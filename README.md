!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReceiveAI - Intelligent Receiving Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Inter, Arial, sans-serif;
            background: #f4f7fb;
            color: #172033;
        }
        button,
        input,
        select {
            font-family: inherit;
        }
        .app {
            min-height: 100vh;
            display: flex;
        }
        /* SIDEBAR */
        .sidebar {
            width: 250px;
            background: #111827;
            color: white;
            padding: 24px 18px;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 35px;
        }
        .logo-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 21px;
            font-weight: bold;
        }
        .logo h2 {
            font-size: 19px;
        }
        .logo span {
            display: block;
            color: #94a3b8;
            font-size: 11px;
            margin-top: 2px;
        }
        .nav-title {
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
            margin: 20px 10px 10px;
            letter-spacing: 1px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 12px;
            border-radius: 9px;
            color: #cbd5e1;
            margin-bottom: 5px;
            cursor: pointer;
            transition: 0.2s;
        }
        .nav-item:hover,
        .nav-item.active {
            background: #1e293b;
            color: white;
        }
        .nav-icon {
            width: 20px;
            text-align: center;
        }
        .sidebar-bottom {
            position: absolute;
            bottom: 25px;
            left: 18px;
            right: 18px;
            background: #1e293b;
            padding: 14px;
            border-radius: 10px;
        }
        .sidebar-bottom p {
            font-size: 12px;
            color: #94a3b8;
        }
        .sidebar-bottom strong {
            color: white;
        }
        /* MAIN */
        .main {
            margin-left: 250px;
            width: calc(100% - 250px);
        }
        .topbar {
            height: 72px;
            background: white;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            position: sticky;
            top: 0;
            z-index: 5;
        }
        .topbar-title h1 {
            font-size: 21px;
        }
        .topbar-title p {
            font-size: 12px;
            color: #64748b;
            margin-top: 3px;
        }
        .user-area {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .status-online {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #16a34a;
            font-size: 12px;
        }
        .online-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #22c55e;
        }
        .avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .content {
            padding: 28px;
            max-width: 1600px;
            margin: auto;
        }
        /* HERO */
        .hero {
            background: linear-gradient(135deg, #172554, #312e81);
            border-radius: 16px;
            padding: 28px;
            color: white;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
        }
        .hero::after {
            content: "";
            width: 300px;
            height: 300px;
            position: absolute;
            right: -100px;
            top: -130px;
            background: rgba(255,255,255,0.06);
            border-radius: 50%;
        }
        .hero-content {
            position: relative;
            z-index: 2;
        }
        .badge {
            display: inline-block;
            background: rgba(255,255,255,0.12);
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            margin-bottom: 12px;
        }
        .hero h2 {
            font-size: 27px;
            margin-bottom: 8px;
        }
        .hero p {
            color: #c7d2fe;
            max-width: 700px;
            line-height: 1.6;
            font-size: 14px;
        }
        /* STATS */
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }
        .stat-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 13px;
            padding: 18px;
        }
        .stat-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #64748b;
            font-size: 12px;
        }
        .stat-number {
            font-size: 27px;
            font-weight: 700;
            margin-top: 10px;
        }
        .stat-icon {
            width: 38px;
            height: 38px;
            background: #eff6ff;
            color: #2563eb;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        /* SECTION */
        .section-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 25px 0 14px;
        }
        .section-title h2 {
            font-size: 18px;
        }
        .section-title p {
            color: #64748b;
            font-size: 12px;
        }
        /* GRID */
        .inspection-grid {
            display: grid;
            grid-template-columns: 0.9fr 1.1fr;
            gap: 20px;
        }
        .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 22px;
        }
        .card h3 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .card-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 18px;
        }
        /* FORM */
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 7px;
            color: #374151;
        }
        .form-control {
            width: 100%;
            padding: 11px 12px;
            border: 1px solid #dbe1ea;
            border-radius: 8px;
            outline: none;
            font-size: 13px;
            transition: 0.2s;
            background: white;
        }
        .form-control:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }
        .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        /* UPLOAD */
        .upload-box {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            cursor: pointer;
            background: #f8fafc;
            transition: 0.2s;
        }
        .upload-box:hover {
            border-color: #2563eb;
            background: #eff6ff;
        }

        .upload-icon {
            font-size: 30px;
            margin-bottom: 8px;
        }

        .upload-box strong {
            font-size: 13px;
            display: block;
        }

        .upload-box span {
            font-size: 11px;
            color: #64748b;
        }

        #imageInput {
            display: none;
        }

        .image-preview {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 14px;
        }

        .preview-item {
            position: relative;
            height: 85px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* BUTTONS */

        .button-row {
            display: flex;
            gap: 10px;
            margin-top: 18px;
        }

        .btn {
            border: none;
            padding: 11px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: 0.2s;
        }

        .btn-primary {
            background: #2563eb;
            color: white;
            flex: 1;
        }

        .btn-primary:hover {
            background: #1d4ed8;
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #334155;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
        }

        /* SCENARIO */

        .scenario-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-bottom: 16px;
        }

        .scenario-btn {
            border: 1px solid #dbe1ea;
            background: white;
            padding: 8px 10px;
            border-radius: 7px;
            cursor: pointer;
            font-size: 11px;
        }

        .scenario-btn:hover {
            background: #eff6ff;
            border-color: #93c5fd;
        }

        /* RESULT */

        .result-card {
            margin-top: 20px;
            display: none;
        }

        .result-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
        }

        .decision {
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }

        .decision-pass {
            background: #dcfce7;
            color: #166534;
        }

        .decision-exception {
            background: #fee2e2;
            color: #991b1b;
        }

        .decision-uncertain {
            background: #fef3c7;
            color: #92400e;
        }

        .checks {
            display: grid;
            gap: 10px;
        }

        .check-row {
            display: grid;
            grid-template-columns: 150px 1fr 100px;
            align-items: center;
            gap: 10px;
            border: 1px solid #edf0f4;
            border-radius: 9px;
            padding: 12px;
        }

        .check-name {
            font-weight: 600;
            font-size: 12px;
        }

        .check-values {
            font-size: 12px;
            color: #64748b;
        }

        .check-values strong {
            color: #172033;
        }

        .verdict {
            text-align: center;
            padding: 6px 8px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: 700;
        }

        .pass {
            background: #dcfce7;
            color: #166534;
        }

        .fail {
            background: #fee2e2;
            color: #991b1b;
        }

        .uncertain {
            background: #fef3c7;
            color: #92400e;
        }

        /* EVIDENCE */

        .evidence-section {
            margin-top: 20px;
        }

        .evidence-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        .evidence-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 13px;
            background: #fafafa;
        }

        .evidence-image {
            height: 130px;
            background: #e2e8f0;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 35px;
            margin-bottom: 10px;
        }

        .evidence-card h4 {
            font-size: 12px;
            margin-bottom: 5px;
        }

        .evidence-card p {
            font-size: 11px;
            color: #64748b;
            line-height: 1.5;
        }

        .confidence {
            margin-top: 8px;
            font-size: 10px;
            color: #64748b;
        }

        .confidence-bar {
            height: 5px;
            background: #e5e7eb;
            border-radius: 5px;
            margin-top: 4px;
            overflow: hidden;
        }

        .confidence-fill {
            height: 100%;
            background: #2563eb;
            border-radius: 5px;
        }

        /* HISTORY */

        .history-card {
            margin-top: 24px;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            font-size: 11px;
            color: #64748b;
            background: #f8fafc;
            padding: 12px;
            font-weight: 600;
        }

        td {
            padding: 13px 12px;
            border-top: 1px solid #edf0f4;
            font-size: 12px;
        }

        .table-status {
            padding: 5px 9px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: 700;
        }

        /* LOADING */

        .loading {
            display: none;
            text-align: center;
            padding: 35px;
        }

        .spinner {
            width: 35px;
            height: 35px;
            border: 4px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: auto auto 12px;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        /* ALERT */

        .alert {
            display: none;
            padding: 12px 15px;
            border-radius: 8px;
            margin-top: 12px;
            font-size: 12px;
        }

        .alert-info {
            background: #eff6ff;
            color: #1d4ed8;
        }

        /* FOOTER */

        .footer {
            text-align: center;
            color: #94a3b8;
            font-size: 11px;
            padding: 30px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
            .inspection-grid {
                grid-template-columns: 1fr;
            }

            .stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 800px) {
            .sidebar {
                width: 70px;
                padding: 20px 10px;
            }

            .logo h2,
            .logo span,
            .nav-item span,
            .nav-title,
            .sidebar-bottom {
                display: none;
            }

            .logo {
                justify-content: center;
            }

            .nav-item {
                justify-content: center;
            }

            .main {
                margin-left: 70px;
                width: calc(100% - 70px);
            }

            .content {
                padding: 16px;
            }

            .topbar {
                padding: 0 16px;
            }

            .stats {
                grid-template-columns: 1fr 1fr;
            }

            .evidence-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {
            .stats {
                grid-template-columns: 1fr;
            }

            .two-columns {
                grid-template-columns: 1fr;
            }

            .check-row {
                grid-template-columns: 1fr;
            }

            .image-preview {
                grid-template-columns: repeat(2, 1fr);
            }

            .hero h2 {
                font-size: 21px;
            }
        }
    </style>
</head>

<body>

<div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <div class="logo">
            <div class="logo-icon">R</div>
            <div>
                <h2>ReceiveAI</h2>
                <span>Receiving Manager</span>
            </div>
        </div>

        <div class="nav-title">Workspace</div>

        <div class="nav-item active">
            <div class="nav-icon">▦</div>
            <span>Dashboard</span>
        </div>

        <div class="nav-item" onclick="scrollToInspection()">
            <div class="nav-icon">⌕</div>
            <span>New Inspection</span>
        </div>

        <div class="nav-item" onclick="scrollToHistory()">
            <div class="nav-icon">▤</div>
            <span>Inspection History</span>
        </div>

        <div class="nav-title">System</div>

        <div class="nav-item">
            <div class="nav-icon">⚙</div>
            <span>Settings</span>
        </div>

        <div class="nav-item">
            <div class="nav-icon">?</div>
            <span>Help</span>
        </div>

        <div class="sidebar-bottom">
            <p>AI Inspection Engine</p>
            <strong>● Online</strong>
        </div>

    </aside>


    <!-- MAIN -->
    <main class="main">

        <!-- TOP BAR -->
        <header class="topbar">

            <div class="topbar-title">
                <h1>Receiving Manager</h1>
                <p>Visual inventory inspection & evidence management</p>
            </div>

            <div class="user-area">
                <div class="status-online">
                    <span class="online-dot"></span>
                    AI Online
                </div>

                <div class="avatar">DJ</div>
            </div>

        </header>


        <div class="content">

            <!-- HERO -->
            <section class="hero">

                <div class="hero-content">

                    <div class="badge">
                        CUBE BUILDATHON · RCV#1
                    </div>

                    <h2>Verify What Actually Arrived.</h2>

                    <p>
                        AI-powered receiving inspection that compares purchase orders
                        with incoming shipment photographs to detect quantity,
                        SKU, variant and visible quality issues.
                    </p>

                </div>

            </section>


            <!-- STATISTICS -->
            <section class="stats">

                <div class="stat-card">

                    <div class="stat-top">
                        <span>Total Inspections</span>
                        <div class="stat-icon">⌕</div>
                    </div>

                    <div class="stat-number" id="totalInspections">
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-top">
                        <span>Passed</span>
                        <div class="stat-icon">✓</div>
                    </div>

                    <div class="stat-number" id="passedInspections">
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-top">
                        <span>Exceptions</span>
                        <div class="stat-icon">!</div>
                    </div>

                    <div class="stat-number" id="failedInspections">
                        0
                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-top">
                        <span>Uncertain</span>
                        <div class="stat-icon">?</div>
                    </div>

                    <div class="stat-number" id="uncertainInspections">
                        0
                    </div>

                </div>

            </section>


            <!-- INSPECTION -->
            <div class="section-title" id="inspectionSection">

                <div>
                    <h2>New Receiving Inspection</h2>
                    <p>Enter the purchase order and upload receiving photographs.</p>
                </div>

            </div>


            <section class="inspection-grid">

                <!-- PO INPUT -->
                <div class="card">

                    <h3>Purchase Order</h3>
                    <p class="card-subtitle">
                        Define what was expected to arrive.
                    </p>


                    <div class="form-group">

                        <label>Purchase Order ID</label>

                        <input
                            type="text"
                            id="poId"
                            class="form-control"
                            value="PO-1001"
                            placeholder="Example: PO-1001"
                        >

                    </div>


                    <div class="form-group">

                        <label>SKU / Product ID</label>

                        <input
                            type="text"
                            id="sku"
                            class="form-control"
                            value="BLUE-BOTTLE-001"
                            placeholder="Example: BLUE-BOTTLE-001"
                        >

                    </div>


                    <div class="two-columns">

                        <div class="form-group">

                            <label>Expected Quantity</label>

                            <input
                                type="number"
                                id="expectedQuantity"
                                class="form-control"
                                value="24"
                                min="1"
                            >

                        </div>


                        <div class="form-group">

                            <label>Variant / Colour</label>

                            <input
                                type="text"
                                id="variant"
                                class="form-control"
                                value="Blue"
                                placeholder="Blue"
                            >

                        </div>

                    </div>


                    <div class="two-columns">

                        <div class="form-group">

                            <label>Units Per Carton</label>

                            <input
                                type="number"
                                id="unitsPerCarton"
                                class="form-control"
                                value="12"
                                min="1"
                            >

                        </div>


                        <div class="form-group">

                            <label>Expected Cartons</label>

                            <input
                                type="number"
                                id="expectedCartons"
                                class="form-control"
                                value="2"
                                min="1"
                            >

                        </div>

                    </div>


                    <div class="form-group">

                        <label>Product Description</label>

                        <input
                            type="text"
                            id="productDescription"
                            class="form-control"
                            value="Blue insulated water bottle"
                        >

                    </div>


                    <!-- DEMO SCENARIOS -->
                    <label style="font-size:12px;font-weight:600;display:block;margin-bottom:8px;">
                        Demo Scenario
                    </label>

                    <div class="scenario-buttons">

                        <button class="scenario-btn" onclick="loadScenario('correct')">
                            ✓ Correct
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('short')">
                            ↓ Short
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('extra')">
                            ↑ Extra
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('wrongsku')">
                            SKU Error
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('variant')">
                            Variant
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('damage')">
                            Damage
                        </button>

                        <button class="scenario-btn" onclick="loadScenario('uncertain')">
                            Uncertain
                        </button>

                    </div>

                </div>


                <!-- PHOTOS -->
                <div class="card">

                    <h3>Receiving Photographs</h3>

                    <p class="card-subtitle">
                        Upload photographs captured at the point of receipt.
                    </p>


                    <label class="upload-box" for="imageInput">

                        <div class="upload-icon">📷</div>

                        <strong>
                            Click to upload receiving photographs
                        </strong>

                        <span>
                            JPG, PNG or WEBP · Multiple images supported
                        </span>

                    </label>

                    <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        multiple
                    >


                    <div class="image-preview" id="imagePreview"></div>


                    <div class="alert alert-info" id="uploadAlert">
                        Images uploaded successfully.
                    </div>


                    <div class="button-row">

                        <button
                            class="btn btn-secondary"
                            onclick="clearInspection()"
                        >
                            Clear
                        </button>

                        <button
                            class="btn btn-primary"
                            onclick="runInspection()"
                        >
                            🔍 Inspect Shipment
                        </button>

                    </div>

                </div>

            </section>


            <!-- LOADING -->
            <div class="card loading" id="loading">

                <div class="spinner"></div>

                <strong>AI is inspecting the shipment...</strong>

                <p style="font-size:12px;color:#64748b;margin-top:6px;">
                    Comparing product identity, quantity, variant and visible condition.
                </p>

            </div>


            <!-- RESULTS -->
            <section class="card result-card" id="resultCard">

                <div class="result-header">

                    <div>
                        <h3>Inspection Result</h3>

                        <p class="card-subtitle" style="margin:4px 0 0;">
                            Evidence-backed receiving decision
                        </p>
                    </div>

                    <div id="overallDecision" class="decision">
                        --
                    </div>

                </div>


                <div class="checks" id="checksContainer"></div>


                <!-- EVIDENCE -->
                <div class="evidence-section">

                    <div class="section-title" style="margin-top:20px;">

                        <div>
                            <h3>Supporting Evidence</h3>
                            <p>
                                Evidence used by the inspection engine
                            </p>
                        </div>

                    </div>


                    <div class="evidence-grid" id="evidenceGrid"></div>

                </div>

            </section>


            <!-- HISTORY -->
            <section class="card history-card" id="historySection">

                <div class="section-title" style="margin-top:0;">

                    <div>
                        <h2>Inspection History</h2>
                        <p>Recent receiving decisions</p>
                    </div>

                    <button
                        class="btn btn-secondary"
                        onclick="clearHistory()"
                    >
                        Clear History
                    </button>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>Inspection ID</th>
                                <th>PO</th>
                                <th>SKU</th>
                                <th>Quantity</th>
                                <th>Decision</th>
                                <th>Time</th>
                            </tr>

                        </thead>

                        <tbody id="historyBody">

                        </tbody>

                    </table>

                </div>

            </section>


            <div class="footer">
                ReceiveAI · CUBE Buildathon RCV#1 · Visual Receiving Inspection Agent
            </div>

        </div>

    </main>

</div>


<script>

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

    function runInspection() {

        const poId =
            document.getElementById("poId").value.trim();

        const sku =
            document.getElementById("sku").value.trim();

        const expectedQuantity =
            parseInt(document.getElementById("expectedQuantity").value);

        const variant =
            document.getElementById("variant").value.trim();

        if (!poId || !sku || !expectedQuantity || !variant) {

            alert("Please complete the Purchase Order information.");

            return;
        }


        document.getElementById("loading").style.display = "block";

        document.getElementById("resultCard").style.display = "none";


        setTimeout(function() {

            const result = generateInspection();

            document.getElementById("loading").style.display = "none";

            displayInspection(result);

            saveInspection(result);

        }, 1800);

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

</script>

</body>
</html>
