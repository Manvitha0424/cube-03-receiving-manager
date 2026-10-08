/**
 * Real VLM Receiving Agent
 * 
 * Orchestrates real AI image analysis against Purchase Order data.
 * Falls back to mock logic ONLY when explicitly requested via demoScenario.
 */

const mockReceivingLogic = require('./mockReceivingLogic');
const OpenAI = require('openai');

async function processInspection(internalRequest) {
    // 1. Fallback to mock logic if explicitly using a demo scenario
    const demoScenarios = ['correct', 'short', 'extra', 'wrongsku', 'variant', 'damage', 'uncertain'];
    if (internalRequest.demoScenario && demoScenarios.includes(internalRequest.demoScenario)) {
        return mockReceivingLogic.processInspection(internalRequest);
    }

    // 2. Real VLM Inspection Flow
    const apiKey = process.env.VLM_API_KEY;
    const provider = process.env.VLM_PROVIDER || 'openai';
    const model = process.env.VLM_MODEL || 'gpt-4o-mini'; // default to a fast vision model

    if (!apiKey) {
        throw { status: 500, message: 'Server configuration error: Real inspection requested but VLM_API_KEY is not configured.' };
    }

    if (provider !== 'openai') {
        throw { status: 501, message: 'Only openai is currently supported as a VLM provider.' };
    }

    const openai = new OpenAI({ apiKey });

    // Prepare system prompt
    const systemPrompt = `
You are an expert Receiving Manager AI. 
Compare the following Purchase Order metadata against the provided images of the shipment.

PO ID: ${internalRequest.poId}
SKU: ${internalRequest.sku}
Expected Quantity: ${internalRequest.expectedQuantity}
Variant: ${internalRequest.variant}
Units Per Carton: ${internalRequest.unitsPerCarton}
Expected Cartons: ${internalRequest.expectedCartons}
Description: ${internalRequest.productDescription || 'N/A'}

Evaluate the following checks. 
If you cannot reliably determine a check, mark the verdict as UNCERTAIN. 
DO NOT GUESS.

Checks required:
1. SKU Identity
2. Quantity
3. Variant
4. Carton Count
5. Damage
6. Components

Respond in STRICT JSON matching this schema:
{
  "checks": [
    {
      "name": "Check Name",
      "expected": "Expected value",
      "observed": "Observed value from images",
      "verdict": "PASS" | "FAIL" | "UNCERTAIN",
      "confidence": <number between 0 and 100>,
      "evidence": "Filename or description of visual evidence"
    }
  ]
}
`;

    // Prepare images payload for OpenAI
    // Assuming internalRequest.images contains base64 strings or URLs
    // For this implementation, we map whatever is passed in `images` assuming it's a data URL.
    const imageContent = (internalRequest.images || []).map(img => {
        // If image is a string (URL or base64), format it. If it's an object with a url, use that.
        let url = typeof img === 'string' ? img : (img.url || img.data);
        return {
            type: "image_url",
            image_url: { url }
        };
    });

    const messages = [
        { role: "system", content: systemPrompt },
        { 
            role: "user", 
            content: [
                { type: "text", text: "Please evaluate the provided shipment images against the PO." },
                ...imageContent
            ]
        }
    ];

    let parsedResult;
    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            response_format: { type: "json_object" },
            max_tokens: 1500,
            temperature: 0.1
        });

        const content = response.choices[0].message.content;
        parsedResult = JSON.parse(content);
        
        if (!parsedResult.checks || !Array.isArray(parsedResult.checks)) {
            throw new Error("Invalid schema returned by model.");
        }
    } catch (err) {
        // Never treat an AI/API timeout or failure as PASS
        console.error("VLM API Error:", err.message);
        throw { status: 502, message: 'Bad Gateway: Failed to communicate with VLM provider or parse response.' };
    }

    // Map it back into our internal result structure
    const checks = parsedResult.checks;
    let decision = "PASS";
    if (checks.some(c => c.verdict === "FAIL")) {
        decision = "EXCEPTION";
    } else if (checks.some(c => c.verdict === "UNCERTAIN")) {
        decision = "UNCERTAIN";
    }
    
    // Calculate overall confidence safely
    let totalConfidence = 0;
    checks.forEach(c => totalConfidence += (typeof c.confidence === 'number' ? c.confidence : 0));
    const confidence = checks.length > 0 ? Math.round(totalConfidence / checks.length) : 0;

    // Gather unique evidence strings
    const evidenceSet = new Set();
    checks.forEach(c => { if (c.evidence) evidenceSet.add(c.evidence); });

    return {
        stage: internalRequest.stage || 'RECEIVING',
        tenant: internalRequest.tenant,
        decision,
        confidence,
        checks,
        evidence: Array.from(evidenceSet),
        errors: []
    };
}

module.exports = {
    processInspection
};
