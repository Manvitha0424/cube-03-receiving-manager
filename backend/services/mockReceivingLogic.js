/**
 * Mock Receiving Logic Service
 * 
 * IMPORTANT: This is a MOCK/TEST receiving logic implementation.
 * It is NOT a production AI model or VLM. It replicates the predefined
 * demo scenarios for testing and integration purposes.
 */

let inspectionCounter = 1001;

function processInspection(internalRequest) {
    const expectedQuantity = internalRequest.expectedQuantity;
    const expectedSku = internalRequest.sku;
    const expectedVariant = internalRequest.variant;
    const expectedCartons = internalRequest.expectedCartons;
    const scenario = internalRequest.demoScenario || 'correct';
    
    let observedQuantity = expectedQuantity;
    let observedSku = expectedSku;
    let observedVariant = expectedVariant;
    let damage = "No visible damage";
    let components = "All expected components visible";
    let cartonCount = expectedCartons;

    if (scenario === "short") {
        observedQuantity = expectedQuantity - 2;
    }

    if (scenario === "extra") {
        observedQuantity = expectedQuantity + 2;
    }

    if (scenario === "wrongsku") {
        observedSku = "RED-MUG-009";
    }

    if (scenario === "variant") {
        observedVariant = "Red";
    }

    if (scenario === "damage") {
        damage = "Crushed carton with visible compression";
    }

    if (scenario === "uncertain") {
        observedQuantity = "Not fully visible";
        components = "Cannot verify from submitted photographs";
    }

    let checks = [];

    /* SKU */
    let skuVerdict = observedSku === expectedSku ? "PASS" : "FAIL";
    if (scenario === "uncertain") {
        skuVerdict = "PASS";
    }

    checks.push({
        name: "SKU Identity",
        expected: expectedSku,
        observed: observedSku,
        verdict: skuVerdict,
        confidence: skuVerdict === "PASS" ? 97 : 93,
        evidence: "photo_01.jpg"
    });

    /* QUANTITY */
    let quantityVerdict;
    if (scenario === "uncertain") {
        quantityVerdict = "UNCERTAIN";
    } else {
        quantityVerdict = observedQuantity === expectedQuantity ? "PASS" : "FAIL";
    }

    checks.push({
        name: "Quantity",
        expected: expectedQuantity + " units",
        observed: typeof observedQuantity === "number" ? observedQuantity + " units" : observedQuantity,
        verdict: quantityVerdict,
        confidence: quantityVerdict === "UNCERTAIN" ? 52 : 94,
        evidence: "photo_01.jpg, photo_02.jpg"
    });

    /* VARIANT */
    let variantVerdict = (observedVariant || "").toLowerCase() === (expectedVariant || "").toLowerCase() ? "PASS" : "FAIL";

    checks.push({
        name: "Variant",
        expected: expectedVariant,
        observed: observedVariant,
        verdict: variantVerdict,
        confidence: variantVerdict === "PASS" ? 95 : 91,
        evidence: "photo_01.jpg"
    });

    /* CARTONS */
    let cartonVerdict;
    if (scenario === "uncertain") {
        cartonVerdict = "UNCERTAIN";
    } else {
        cartonVerdict = cartonCount === expectedCartons ? "PASS" : "FAIL";
    }

    checks.push({
        name: "Carton Count",
        expected: expectedCartons + " cartons",
        observed: scenario === "uncertain" ? "Not fully visible" : cartonCount + " cartons",
        verdict: cartonVerdict,
        confidence: cartonVerdict === "UNCERTAIN" ? 49 : 92,
        evidence: "photo_02.jpg"
    });

    /* DAMAGE */
    let damageVerdict = damage === "No visible damage" ? "PASS" : "FAIL";
    if (scenario === "uncertain") {
        damageVerdict = "UNCERTAIN";
        damage = "Condition cannot be fully verified";
    }

    checks.push({
        name: "Damage",
        expected: "No visible damage",
        observed: damage,
        verdict: damageVerdict,
        confidence: damageVerdict === "UNCERTAIN" ? 45 : 89,
        evidence: "photo_03.jpg"
    });

    /* COMPONENTS */
    let componentVerdict = scenario === "uncertain" ? "UNCERTAIN" : "PASS";

    checks.push({
        name: "Components",
        expected: "Complete",
        observed: components,
        verdict: componentVerdict,
        confidence: componentVerdict === "UNCERTAIN" ? 42 : 87,
        evidence: "photo_04.jpg"
    });

    /* OVERALL DECISION */
    let decision = "PASS";
    if (checks.some(check => check.verdict === "FAIL")) {
        decision = "EXCEPTION";
    } else if (checks.some(check => check.verdict === "UNCERTAIN")) {
        decision = "UNCERTAIN";
    }
    
    // Compute overall confidence simply as an average of the checks for the mock
    const totalConf = checks.reduce((acc, curr) => acc + curr.confidence, 0);
    const overallConfidence = Math.round(totalConf / checks.length);

    return {
        stage: internalRequest.stage,
        tenant: internalRequest.tenant,
        decision,
        confidence: overallConfidence,
        checks,
        evidence: ["photo_01.jpg", "photo_02.jpg", "photo_03.jpg", "photo_04.jpg"],
        errors: []
    };
}

module.exports = {
    processInspection
};
