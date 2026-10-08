const http = require('http');

function makeRequest(method, path, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch(e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("Waiting for server...");
    await new Promise(r => setTimeout(r, 2000));

    // A. valid correct scenario → 200 PASS
    const authHeaders = { 'Authorization': 'Bearer dev_secret', 'x-tenant-id': 'dev_tenant' };
    const basePayload = {
        poId: 'PO-1001',
        sku: 'BLUE-BOTTLE-001',
        expectedQuantity: 24,
        unitsPerCarton: 12,
        expectedCartons: 2,
        demoScenario: 'correct'
    };

    let res = await makeRequest('POST', '/run', authHeaders, basePayload);
    console.log(`A. Valid Correct Scenario: ${res.status} - Decision: ${res.data.decision}`);

    // B. short → 200 EXCEPTION
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, demoScenario: 'short' });
    console.log(`B. Short Scenario: ${res.status} - Decision: ${res.data.decision}`);

    // C. wrongsku → 200 EXCEPTION
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, demoScenario: 'wrongsku' });
    console.log(`C. Wrong SKU Scenario: ${res.status} - Decision: ${res.data.decision}`);

    // D. uncertain → 200 UNCERTAIN
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, demoScenario: 'uncertain' });
    console.log(`D. Uncertain Scenario: ${res.status} - Decision: ${res.data.decision}`);

    // E. missing auth → 401
    res = await makeRequest('POST', '/run', { 'x-tenant-id': 'dev_tenant' }, basePayload);
    console.log(`E. Missing Auth: ${res.status} - Error: ${res.data.error}`);

    // F. wrong tenant → 403
    res = await makeRequest('POST', '/run', { 'Authorization': 'Bearer dev_secret', 'x-tenant-id': 'wrong_tenant' }, basePayload);
    console.log(`F. Wrong Tenant: ${res.status} - Error: ${res.data.error}`);

    // G. missing poId → 400
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, poId: '' });
    console.log(`G. Missing poId: ${res.status} - Error: ${res.data.error}`);

    // H. missing sku → 400
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, sku: '' });
    console.log(`H. Missing sku: ${res.status} - Error: ${res.data.error}`);

    // I. NaN/non-finite expectedQuantity → 400
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, expectedQuantity: NaN });
    console.log(`I. NaN expectedQuantity: ${res.status} - Error: ${res.data.error}`);

    // J. non-numeric expectedQuantity → 400
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, expectedQuantity: "24" });
    console.log(`J. non-numeric expectedQuantity: ${res.status} - Error: ${res.data.error}`);

    // K. invalid demoScenario → 400
    res = await makeRequest('POST', '/run', authHeaders, { ...basePayload, demoScenario: 'magic' });
    console.log(`K. Invalid demoScenario: ${res.status} - Error: ${res.data.error}`);

    // L. malformed JSON/request body → safe 400 behavior
    res = await makeRequest('POST', '/run', authHeaders, null);
    // actually, express.json() might just return empty object {} if no body is passed, let's see. 
    console.log(`L. Malformed request body (null): ${res.status} - Error: ${res.data.error}`);

    // M. Real VLM test without API Key -> 500 configuration error
    const noDemoPayload = { ...basePayload };
    delete noDemoPayload.demoScenario;
    res = await makeRequest('POST', '/run', authHeaders, noDemoPayload);
    console.log(`M. Real VLM without key: ${res.status} - Error: ${res.data.error}`);
}

runTests().catch(console.error);
