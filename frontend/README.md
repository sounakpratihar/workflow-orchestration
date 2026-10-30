# FlowForge - Multi-Tenant Workflow Orchestration Engine (Frontend)

A high-performance, enterprise-grade SaaS frontend for a Multi-Tenant Workflow Orchestration Engine, built with **React**, **Vite**, **Tailwind CSS**, and **React Flow (@xyflow/react)**.

Inspired by modern automation platforms such as **n8n**, **Zapier**, **Make.com**, and **Linear**.

---

## 🚀 Key Features

### 1. Visual DAG Workflow Builder (React Flow)
- **7 Custom Specialized Nodes**:
  - `StartNode` (Green): Webhook, Schedule/Cron (`0 2 * * *`), System Event, or Manual trigger.
  - `TaskNode` (Indigo): Custom action handlers, retry thresholds, timeouts.
  - `ConditionNode` (Amber): JavaScript expression evaluation (`payload.amount > 1000`) with dual **TRUE** (Emerald) and **FALSE** (Rose) branching ports.
  - `ApiNode` (Cyan): Outbound REST HTTP calls (GET, POST, PUT, DELETE, PATCH), URLs, headers, payload body, and timeout.
  - `DelayNode` (Purple): Configurable delay intervals (milliseconds, seconds, minutes, hours).
  - `LoopNode` (Orange): Controlled repeated iterations with maximum iteration bounds and batch size.
  - `EndNode` (Slate/Red): Terminal outcomes (COMPLETED, FAILED, CANCELLED) and event emission.
- **Node Palette**: Drag-and-drop or click-to-insert nodes directly onto the canvas.
- **Node Configuration Slide-Over**: Deep attribute editing without leaving the canvas.
- **Topological Validation & DFS Cycle Detection**:
  - 3-Color DFS cycle detection with visual glowing red pulse on loop edges.
  - One-click "Break Loop Edge" auto-resolver.
  - Kahn's algorithm topological execution ordering.
  - Validation checks for missing Start/End nodes, duplicate IDs, and disconnected steps.
- **Interactive Test Simulator**: Step-by-step canvas simulation highlighting active nodes in real time.
- **History & Canvas Controls**: 25-step Undo / Redo stack, Zoom, Fit View, Minimap, Dot Grid, JSON Export/Import.

### 2. Multi-Tenant Database Isolation Topology
- Real-time organization switching with ambient tenant scoping:
  - **Strategy A: Discriminator Scoped** (Logical partitioned collections in `workflow_platform`).
  - **Strategy B: Dedicated Multi-DB Pool** (Physical database isolation e.g. `tenant_acme_corp`).
- Quota meters, storage metrics, SLA tracking, and team RBAC (Owner, Admin, Developer, Viewer).

### 3. Real-Time Execution Monitoring & History
- Real-time execution playback: states `PENDING`, `RUNNING`, `PAUSED`, `COMPLETED`, `FAILED`, `CANCELLED`.
- Chronological event timeline with duration, timestamps, diagnostic payloads, and log streaming.
- Execution controls: Pause, Resume, Cancel, and Retry failed executions.
- Searchable & filterable execution history table with date and status filters.

### 4. Cryptographic API Key Management
- Generation of tenant-scoped API keys matching the format:
  `wk_live_<tenantId>_<entropy>.<checksum>`.
- Scopes: `workflows:read`, `workflows:write`, `workflows:execute`, `keys:manage`.
- Masked key table, copy UI, instant key rotation, and key revocation.

### 5. Analytics Dashboard & Telemetry
- Responsive KPIs with change trends.
- Recharts Area chart for 24-hour and 7-day workflow execution throughput.
- Recharts Donut chart for node workload distribution.
- Live stream of recent runs and active pipelines.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6
- **Routing**: React Router DOM v6
- **Graph Canvas**: React Flow (`@xyflow/react`)
- **Styling**: Tailwind CSS (with Dark/Light Mode toggle)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios (with `X-Tenant-ID` and Bearer token interceptors)
- **Real-Time Client**: Socket.IO Client (with mock event bus fallback for standalone demo mode)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## 📁 Project Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── CustomNodes/
│   │   │   ├── StartNode.jsx
│   │   │   ├── TaskNode.jsx
│   │   │   ├── ConditionNode.jsx
│   │   │   ├── ApiNode.jsx
│   │   │   ├── DelayNode.jsx
│   │   │   ├── LoopNode.jsx
│   │   │   └── EndNode.jsx
│   │   ├── CreateWorkflowModal.jsx
│   │   ├── DataTable.jsx
│   │   ├── ExecutionTimeline.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── NodeConfigPanel.jsx
│   │   ├── NodePalette.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ValidationPanel.jsx
│   │   ├── WorkflowCanvas.jsx
│   │   └── WorkflowCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── ApiKeys.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExecutionHistory.jsx
│   │   ├── Executions.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   ├── Tenants.jsx
│   │   └── Workflows.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── apiKeyService.js
│   │   ├── executionService.js
│   │   ├── socketService.js
│   │   └── workflowService.js
│   ├── utils/
│   │   └── graphAlgorithms.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
