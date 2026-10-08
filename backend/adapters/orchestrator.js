/**
 * Orchestrator Request/Response Adapter
 * 
 * IMPORTANT: This adapter converts external requests into an INTERNAL format,
 * and formats INTERNAL responses back into provisional external responses.
 * External field names are PROVISIONAL until the official Round 3 contract is available.
 */

function adaptRequest(req) {
    // Extract provisional fields from request body/headers
    return {
        stage: req.body.stage || 'RECEIVING',
        tenant: req.tenant, // populated by tenant middleware
        poId: req.body.poId || req.body.po_number,
        sku: req.body.sku || req.body.product_id,
        expectedQuantity: parseInt(req.body.expectedQuantity || req.body.expected_quantity, 10),
        variant: req.body.variant,
        unitsPerCarton: parseInt(req.body.unitsPerCarton || req.body.units_per_carton, 10),
        expectedCartons: parseInt(req.body.expectedCartons || req.body.expected_cartons, 10),
        productDescription: req.body.productDescription || req.body.description,
        images: req.body.images || [],
        demoScenario: req.body.demoScenario,
        previousEvidence: req.body.previousEvidence || []
    };
}

function adaptResponse(internalResult) {
    // Convert internal result into provisional external response
    return {
        stage: internalResult.stage,
        tenant: internalResult.tenant,
        decision: internalResult.decision,
        confidence: internalResult.confidence,
        checks: internalResult.checks,
        evidence: internalResult.evidence,
        errors: internalResult.errors || []
    };
}

module.exports = {
    adaptRequest,
    adaptResponse
};
