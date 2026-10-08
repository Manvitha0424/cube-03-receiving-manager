# CUBE-03 Receiving Manager

The Receiving Manager is a decoupled frontend/backend application intended to orchestrate visual inventory inspection and evidence management.

**IMPORTANT: This repository currently contains a sophisticated UI prototype wired to a dual-mode backend. It supports both deterministic demo scenarios and a real Vision Language Model (VLM) via OpenAI.**

## Round 3 Integration Status
- Local frontend/backend integration: COMPLETE
- Local API validation: COMPLETE
- Tenant/auth development validation: COMPLETE
- Real Receiving AI/VLM: IMPLEMENTED
- Official orchestrator contract: PENDING
- Production deployment: NOT STARTED

## Architecture

The application is structured into a distinct frontend UI and a Node.js/Express backend API. 

The current request flow operates as follows:
```text
Browser
→ frontend
→ POST /run
→ authentication
→ tenant validation
→ request adapter
→ Receiving Agent
   ↓
   IF demoScenario exists → Mock logic
   IF demoScenario absent → Real VLM (OpenAI)
→ response adapter
→ frontend
```

### PROVISIONAL / DEVELOPMENT ONLY
The external API boundary is currently built using temporary placeholders because the official orchestrator contract is not yet available.
The following implementations are **PROVISIONAL / DEVELOPMENT ONLY**:
- **Authentication Convention:** Uses `Authorization: Bearer <secret>`
- **Development Secret:** Handled via environment variable `RECEIVING_API_SECRET`
- **Tenant Header:** Uses `x-tenant-id`
- **Development Tenant:** Handled via environment variable `ALLOWED_TENANT` (defaults to `dev_tenant` in tests)
- **External JSON schema:** The exact field names in the external request/response payload

### Mock Receiving Logic vs Real VLM
The backend seamlessly switches between two modes:
1. **Mock Logic:** A deterministic mock/test logic designed to replicate predefined demo scenarios.
2. **Real VLM:** A production-ready integration with OpenAI's Vision capabilities. **Known limitation: Real VLM inference requires a funded/usable provider API account.** If the API account has no credits (429), the backend safely yields a `502 Bad Gateway` error and never hallucinates a successful result.

## Local Setup

### Prerequisites
- Node.js installed

### Installation & Execution
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local server:
   ```bash
   npm start
   ```
3. Open a web browser and navigate to:
   ```text
   http://localhost:3000
   ```

### API Endpoints
- **`GET /health`**
  Returns a simple JSON status to verify server health. Does not require authentication.
- **`POST /run`**
  Executes the receiving inspection. Requires provisional authentication and tenant headers.

### Development Authentication & Tenant
For local UI testing, the frontend will prompt you for a development secret (e.g., `dev_secret`). This is cached in the browser's `sessionStorage` to avoid hardcoding credentials in the source code.
For API calls, ensure your environment variables `RECEIVING_API_SECRET` and `ALLOWED_TENANT` match the values you pass in your request headers.

## Demo Scenarios

The backend mock logic natively supports several deterministic testing scenarios, which will force specific outcomes:
- `correct` → PASS
- `short` → EXCEPTION (Subtracts 2 from expected quantity)
- `extra` → EXCEPTION (Adds 2 to expected quantity)
- `wrongsku` → EXCEPTION (Overrides observed SKU)
- `variant` → EXCEPTION (Overrides observed variant)
- `damage` → EXCEPTION (Simulates visible carton damage)
- `uncertain` → UNCERTAIN (Simulates inability to verify evidence)

## Validation & Testing

A local validation script is included to test the API boundary and internal logic.
Ensure the server is running, then execute:
```bash
node test.js
```

## Missing Functionality
The project is currently awaiting the following before proceeding to production:
- Official Round 3 orchestrator JSON contract
- Official authentication header specification
- Official tenant convention specification
- Production-safe authentication/deployment configuration
- Persistent storage (if required by the final orchestrator design)

*(Note: The massive legacy HTML prototype embedded in earlier versions of this documentation has been securely decoupled into the `frontend/` directory.)*
