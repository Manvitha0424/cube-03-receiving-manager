/**
 * Run Controller
 */
const orchestratorAdapter = require('../adapters/orchestrator');
const receivingService = require('../services/receivingAgent');

const SUPPORTED_SCENARIOS = ['correct', 'short', 'extra', 'wrongsku', 'variant', 'damage', 'uncertain'];

function validateInternalRequest(reqBody, internalRequest) {
    if (!reqBody || typeof reqBody !== 'object') {
        throw { status: 400, message: 'Bad Request: JSON body is missing or not an object.' };
    }
    
    if (!internalRequest.poId || typeof internalRequest.poId !== 'string' || internalRequest.poId.trim() === '') {
        throw { status: 400, message: 'Bad Request: poId is required and must be a non-empty string.' };
    }

    if (!internalRequest.sku || typeof internalRequest.sku !== 'string' || internalRequest.sku.trim() === '') {
        throw { status: 400, message: 'Bad Request: sku is required and must be a non-empty string.' };
    }

    if (typeof internalRequest.expectedQuantity !== 'number' || !Number.isFinite(internalRequest.expectedQuantity)) {
        throw { status: 400, message: 'Bad Request: expectedQuantity must be a finite number.' };
    }
    
    if (typeof internalRequest.unitsPerCarton !== 'number' || !Number.isFinite(internalRequest.unitsPerCarton)) {
        throw { status: 400, message: 'Bad Request: unitsPerCarton must be a finite number.' };
    }

    if (typeof internalRequest.expectedCartons !== 'number' || !Number.isFinite(internalRequest.expectedCartons)) {
        throw { status: 400, message: 'Bad Request: expectedCartons must be a finite number.' };
    }

    if (internalRequest.demoScenario === 'variant' && (!internalRequest.variant || internalRequest.variant.trim() === '')) {
        throw { status: 400, message: 'Bad Request: variant is required for the variant scenario.' };
    }

    if (internalRequest.productDescription !== undefined && typeof internalRequest.productDescription !== 'string') {
        throw { status: 400, message: 'Bad Request: productDescription must be a string if provided.' };
    }

    if (internalRequest.images !== undefined && !Array.isArray(internalRequest.images)) {
        throw { status: 400, message: 'Bad Request: images must be an array if provided.' };
    }

    if (internalRequest.demoScenario && !SUPPORTED_SCENARIOS.includes(internalRequest.demoScenario)) {
        throw { status: 400, message: 'Bad Request: unsupported demoScenario.' };
    }
}

async function runInspection(req, res) {
    try {
        // 1. Map external request to internal structure
        const internalRequest = orchestratorAdapter.adaptRequest(req);
        
        // 2. Validate internal request
        validateInternalRequest(req.body, internalRequest);
        
        // 3. Pass internal structure to receiving logic
        const internalResult = await receivingService.processInspection(internalRequest);
        
        // 4. Map internal result back to provisional external structure
        const externalResponse = orchestratorAdapter.adaptResponse(internalResult);
        
        // 5. Return
        return res.status(200).json(externalResponse);
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ error: error.message });
        }
        // Safe error handling without exposing stack traces
        console.error('Error during /run processing:', error.message);
        return res.status(500).json({ error: 'Internal processing error.' });
    }
}

module.exports = {
    runInspection
};
