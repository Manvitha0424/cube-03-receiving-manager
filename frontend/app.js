/* ==========================================
       APPLICATION STATE
    ========================================== */

    let uploadedImages = [];

    let history = [];

    let inspectionCounter = 1001;


    /* ==========================================
       DOM ELEMENTS
    ========================================== */

    const imageInput = document.getElementById("imageInput");
    const imagePreview = document.getElementById("imagePreview");
    const uploadAlert = document.getElementById("uploadAlert");


    /* ==========================================
       IMAGE UPLOAD
    ========================================== */

    imageInput.addEventListener("change", function(event) {

        const files = Array.from(event.target.files);

        uploadedImages = [];

        imagePreview.innerHTML = "";

        files.forEach((file, index) => {

            if (!file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {

                uploadedImages.push({
                    name: file.name,
                    url: e.target.result
                });

                const preview = document.createElement("div");

                preview.className = "preview-item";

                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Receiving image">
                `;

                imagePreview.appendChild(preview);

            };

            reader.readAsDataURL(file);

        });

        if (files.length > 0) {

            uploadAlert.style.display = "block";

            setTimeout(function() {
                uploadAlert.style.display = "none";
            }, 3000);

        }

    });


    /* ==========================================
       LOAD DEMO SCENARIOS
    ========================================== */

    function loadScenario(type) {

        document.getElementById("poId").value = "PO-1001";

        document.getElementById("sku").value = "BLUE-BOTTLE-001";

        document.getElementById("expectedQuantity").value = "24";

        document.getElementById("variant").value = "Blue";

        document.getElementById("unitsPerCarton").value = "12";

        document.getElementById("expectedCartons").value = "2";

        document.getElementById("productDescription").value =
            "Blue insulated water bottle";


        if (type === "correct") {

            window.demoScenario = "correct";

        }

        if (type === "short") {

            window.demoScenario = "short";

        }

        if (type === "extra") {

            window.demoScenario = "extra";

        }

        if (type === "wrongsku") {

            window.demoScenario = "wrongsku";

        }

        if (type === "variant") {

            window.demoScenario = "variant";

        }

        if (type === "damage") {

            window.demoScenario = "damage";

        }

        if (type === "uncertain") {

            window.demoScenario = "uncertain";

        }

        showMessage(
            "Scenario loaded. Click “Inspect Shipment” to run the inspection.",
            "info"
        );

    }


    /* ==========================================
       MESSAGE
    ========================================== */

    function showMessage(message, type) {

        uploadAlert.innerText = message;

        uploadAlert.style.display = "block";

        setTimeout(function() {
            uploadAlert.style.display = "none";
        }, 3500);

    }


    /* ==========================================
       RUN INSPECTION
    ========================================== */

    async function runInspection() {
        const poId = document.getElementById("poId").value.trim();
        const sku = document.getElementById("sku").value.trim();
        const expectedQuantity = parseInt(document.getElementById("expectedQuantity").value);
        const variant = document.getElementById("variant").value.trim();
        const expectedCartons = parseInt(document.getElementById("expectedCartons").value) || 2;
        const unitsPerCarton = document.getElementById("unitsPerCarton") ? parseInt(document.getElementById("unitsPerCarton").value) : 12;
        const productDescription = "Development product description";

        if (!poId || !sku || !expectedQuantity || !variant) {
            alert("Please complete the Purchase Order information.");
            return;
        }

        document.getElementById("loading").style.display = "block";
        document.getElementById("resultCard").style.display = "none";

        // Prompt for secret for safe local development to avoid hardcoding in source
        let devSecret = sessionStorage.getItem('devSecret');
        if (!devSecret) {
            devSecret = prompt("Enter Local Dev API Secret (e.g., dev_secret):");
            if (devSecret) {
                sessionStorage.setItem('devSecret', devSecret);
            } else {
                document.getElementById("loading").style.display = "none";
                alert("Authentication required.");
                return;
            }
        }

        const payload = {
            poId,
            sku,
            expectedQuantity,
            variant,
            expectedCartons,
            unitsPerCarton,
            productDescription,
            images: [],
            demoScenario: window.demoScenario || "correct"
        };

        try {
            const response = await fetch('/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${devSecret}`,
                    'x-tenant-id': 'dev_tenant'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            document.getElementById("loading").style.display = "none";

            if (!response.ok) {
                alert(`Backend Error: ${result.error || 'Unknown error'} (${response.status})`);
                if (response.status === 401) {
                    sessionStorage.removeItem('devSecret');
                }
                return;
            }

            // Restore the PO and timestamp data that the UI depends on
            result.poId = poId;
            result.timestamp = new Date().toISOString();

            displayInspection(result);
            saveInspection(result);
        } catch (err) {
            document.getElementById("loading").style.display = "none";
            alert("Network Error: Could not connect to backend.");
        }
    }


    /* ==========================================
       GENERATE INSPECTION
    ========================================== */

    function generateInspection() {

        const poId =
            document.getElementById("poId").value.trim();

        const expectedSku =
            document.getElementById("sku").value.trim();

        const expectedQuantity =
            parseInt(document.getElementById("expectedQuantity").value);

        const expectedVariant =
            document.getElementById("variant").value.trim();

        const expectedCartons =
            parseInt(document.getElementById("expectedCartons").value);

        let scenario =
            window.demoScenario || "correct";


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

        let skuVerdict =
            observedSku === expectedSku
                ? "PASS"
                : "FAIL";


        if (scenario === "uncertain") {
            skuVerdict = "PASS";
        }


        checks.push({

            name: "SKU Identity",

            expected: expectedSku,

            observed: observedSku,

            verdict: skuVerdict,

            confidence: skuVerdict === "PASS" ? 97 : 93,

            evidence:
                "photo_01.jpg"

        });


        /* QUANTITY */

        let quantityVerdict;


        if (scenario === "uncertain") {

            quantityVerdict = "UNCERTAIN";

        } else {

            quantityVerdict =
                observedQuantity === expectedQuantity
                    ? "PASS"
                    : "FAIL";

        }


        checks.push({

            name: "Quantity",

            expected: expectedQuantity + " units",

            observed:
                typeof observedQuantity === "number"
                    ? observedQuantity + " units"
                    : observedQuantity,

            verdict: quantityVerdict,

            confidence:
                quantityVerdict === "UNCERTAIN"
                    ? 52
                    : 94,

            evidence:
                "photo_01.jpg, photo_02.jpg"

        });


        /* VARIANT */

        let variantVerdict =
            observedVariant.toLowerCase() ===
            expectedVariant.toLowerCase()
                ? "PASS"
                : "FAIL";


        checks.push({

            name: "Variant",

            expected: expectedVariant,

            observed: observedVariant,

            verdict: variantVerdict,

            confidence:
                variantVerdict === "PASS"
                    ? 95
                    : 91,

            evidence:
                "photo_01.jpg"

        });


        /* CARTONS */

        let cartonVerdict;

        if (scenario === "uncertain") {

            cartonVerdict = "UNCERTAIN";

        } else {

            cartonVerdict =
                cartonCount === expectedCartons
                    ? "PASS"
                    : "FAIL";

        }


        checks.push({

            name: "Carton Count",

            expected: expectedCartons + " cartons",

            observed:
                scenario === "uncertain"
                    ? "Not fully visible"
                    : cartonCount + " cartons",

            verdict: cartonVerdict,

            confidence:
                cartonVerdict === "UNCERTAIN"
                    ? 49
                    : 92,

            evidence:
                "photo_02.jpg"

        });


        /* DAMAGE */

        let damageVerdict =
            damage === "No visible damage"
                ? "PASS"
                : "FAIL";


        if (scenario === "uncertain") {

            damageVerdict = "UNCERTAIN";

            damage = "Condition cannot be fully verified";

        }


        checks.push({

            name: "Damage",

            expected: "No visible damage",

            observed: damage,

            verdict: damageVerdict,

            confidence:
                damageVerdict === "UNCERTAIN"
                    ? 45
                    : 89,

            evidence:
                "photo_03.jpg"

        });


        /* COMPONENTS */

        let componentVerdict =
            scenario === "uncertain"
                ? "UNCERTAIN"
                : "PASS";


        checks.push({

            name: "Components",

            expected: "Complete",

            observed: components,

            verdict: componentVerdict,

            confidence:
                componentVerdict === "UNCERTAIN"
                    ? 42
                    : 87,

            evidence:
                "photo_04.jpg"

        });


        /* OVERALL DECISION */

        let decision = "PASS";


        if (
            checks.some(check => check.verdict === "FAIL")
        ) {

            decision = "EXCEPTION";

        } else if (
            checks.some(check => check.verdict === "UNCERTAIN")
        ) {

            decision = "UNCERTAIN";

        }


        return {

            id:
                "INS-" +
                inspectionCounter++,

            poId,

            sku: expectedSku,

            expectedQuantity,

            observedQuantity,

            decision,

            checks,

            timestamp:
                new Date().toLocaleString()

        };

    }


    /* ==========================================
       DISPLAY INSPECTION
    ========================================== */

    function displayInspection(result) {

        const resultCard =
            document.getElementById("resultCard");

        resultCard.style.display = "block";


        const decisionElement =
            document.getElementById("overallDecision");


        decisionElement.innerText =
            result.decision;


        decisionElement.className =
            "decision " +
            (
                result.decision === "PASS"
                    ? "decision-pass"
                    :
                result.decision === "EXCEPTION"
                    ? "decision-exception"
                    :
                    "decision-uncertain"
            );


        const container =
            document.getElementById("checksContainer");

        container.innerHTML = "";


        result.checks.forEach(check => {

            const row =
                document.createElement("div");

            row.className = "check-row";


            const verdictClass =
                check.verdict.toLowerCase();


            row.innerHTML = `

                <div class="check-name">
                    ${check.name}
                </div>

                <div class="check-values">

                    <div>
                        Expected:
                        <strong>${check.expected}</strong>
                    </div>

                    <div>
                        Observed:
                        <strong>${check.observed}</strong>
                    </div>

                </div>

                <div>

                    <div class="verdict ${verdictClass}">
                        ${check.verdict}
                    </div>

                    <div style="
                        font-size:9px;
                        color:#64748b;
                        text-align:center;
                        margin-top:4px;
                    ">
                        ${check.confidence}% confidence
                    </div>

                </div>

            `;


            container.appendChild(row);

        });


        displayEvidence(result);


        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* ==========================================
       EVIDENCE
    ========================================== */

    function displayEvidence(result) {

        const grid =
            document.getElementById("evidenceGrid");

        grid.innerHTML = "";


        result.checks.forEach((check, index) => {

            let icon = "📦";


            if (check.name === "Damage") {
                icon = "⚠️";
            }

            if (check.name === "Quantity") {
                icon = "🔢";
            }

            if (check.name === "Variant") {
                icon = "🎨";
            }

            if (check.name === "SKU Identity") {
                icon = "🏷️";
            }

            if (check.name === "Components") {
                icon = "🔧";
            }


            const evidence =
                document.createElement("div");

            evidence.className =
                "evidence-card";


            evidence.innerHTML = `

                <div class="evidence-image">

                    ${icon}

                </div>

                <h4>
                    ${check.name} Evidence
                </h4>

                <p>
                    ${getEvidenceText(check)}
                </p>

                <div class="confidence">

                    Confidence:
                    <strong>${check.confidence}%</strong>

                    <div class="confidence-bar">

                        <div
                            class="confidence-fill"
                            style="width:${check.confidence}%"
                        ></div>

                    </div>

                </div>

                <div style="
                    margin-top:8px;
                    font-size:10px;
                    color:#64748b;
                ">

                    Source:
                    ${check.evidence}

                </div>

            `;


            grid.appendChild(evidence);

        });

    }


    /* ==========================================
       EVIDENCE TEXT
    ========================================== */

    function getEvidenceText(check) {

        if (check.verdict === "PASS") {

            return (
                "The submitted receiving evidence " +
                "supports the expected value for this check."
            );

        }


        if (check.verdict === "FAIL") {

            return (
                "The submitted receiving evidence " +
                "shows a mismatch between the expected " +
                "and observed condition."
            );

        }


        return (
            "Available photographs do not provide " +
            "enough evidence to establish this check " +
            "with confidence."
        );

    }


    /* ==========================================
       SAVE HISTORY
    ========================================== */

    function saveInspection(result) {

        history.unshift(result);

        if (history.length > 10) {

            history.pop();

        }

        updateStatistics();

        updateHistory();

    }


    /* ==========================================
       UPDATE STATISTICS
    ========================================== */

    function updateStatistics() {

        const total =
            history.length;

        const passed =
            history.filter(
                item => item.decision === "PASS"
            ).length;

        const exceptions =
            history.filter(
                item => item.decision === "EXCEPTION"
            ).length;

        const uncertain =
            history.filter(
                item => item.decision === "UNCERTAIN"
            ).length;


        document.getElementById(
            "totalInspections"
        ).innerText = total;


        document.getElementById(
            "passedInspections"
        ).innerText = passed;


        document.getElementById(
            "failedInspections"
        ).innerText = exceptions;


        document.getElementById(
            "uncertainInspections"
        ).innerText = uncertain;

    }


    /* ==========================================
       UPDATE HISTORY
    ========================================== */

    function updateHistory() {

        const body =
            document.getElementById("historyBody");

        body.innerHTML = "";


        history.forEach(item => {

            const row =
                document.createElement("tr");


            const statusClass =
                item.decision === "PASS"
                    ? "pass"
                    :
                item.decision === "EXCEPTION"
                    ? "fail"
                    :
                    "uncertain";


            row.innerHTML = `

                <td>
                    <strong>${item.id}</strong>
                </td>

                <td>
                    ${item.poId}
                </td>

                <td>
                    ${item.sku}
                </td>

                <td>
                    ${
                        typeof item.observedQuantity === "number"
                            ? item.observedQuantity
                            : item.observedQuantity
                    }
                    /
                    ${item.expectedQuantity}
                </td>

                <td>

                    <span class="table-status ${statusClass}">
                        ${item.decision}
                    </span>

                </td>

                <td>
                    ${item.timestamp}
                </td>

            `;


            body.appendChild(row);

        });

    }


    /* ==========================================
       CLEAR INSPECTION
    ========================================== */

    function clearInspection() {

        document.getElementById("poId").value =
            "PO-1001";

        document.getElementById("sku").value =
            "BLUE-BOTTLE-001";

        document.getElementById("expectedQuantity").value =
            "24";

        document.getElementById("variant").value =
            "Blue";

        document.getElementById("unitsPerCarton").value =
            "12";

        document.getElementById("expectedCartons").value =
            "2";

        document.getElementById("productDescription").value =
            "Blue insulated water bottle";


        imagePreview.innerHTML = "";

        imageInput.value = "";

        uploadedImages = [];

        document.getElementById(
            "resultCard"
        ).style.display = "none";

        window.demoScenario = "correct";

    }


    /* ==========================================
       CLEAR HISTORY
    ========================================== */

    function clearHistory() {

        if (
            confirm(
                "Are you sure you want to clear inspection history?"
            )
        ) {

            history = [];

            updateStatistics();

            updateHistory();

        }

    }


    /* ==========================================
       NAVIGATION
    ========================================== */

    function scrollToInspection() {

        document.getElementById(
            "inspectionSection"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }


    function scrollToHistory() {

        document.getElementById(
            "historySection"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }


    /* ==========================================
       INITIALIZATION
    ========================================== */

    window.demoScenario = "correct";

    updateStatistics();

    updateHistory();