/**
 * Enterprise Multi-Tenant Workflow Engine - Mock Datasets
 * Simulates enterprise SaaS telemetry, multi-tenant database partitioning,
 * DAG workflow graphs, and execution streams.
 */

export const MOCK_TENANTS = [
  {
    id: 'acme_corp',
    name: 'Acme Corporation',
    tier: 'ENTERPRISE',
    strategy: 'Dedicated Multi-DB Pool',
    strategyBadge: 'Dedicated DB Pool',
    database: 'tenant_acme_corp',
    isolationType: 'Physical Database Boundary',
    storage: '1.8 GB / 10 GB',
    activeWorkflows: 24,
    totalWorkflows: 32,
    membersCount: 14,
    monthlyExecutions: '124,500 / 500,000',
    sla: '99.99%',
    region: 'us-east-1 (N. Virginia)',
    createdAt: '2025-01-12T08:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'zenith_ai',
    name: 'Zenith AI Technologies',
    tier: 'PRO',
    strategy: 'Discriminator Scoped Partition',
    strategyBadge: 'Discriminator Scoped',
    database: 'workflow_platform',
    isolationType: 'Logical Scoped Collection',
    storage: '420 MB / 2 GB',
    activeWorkflows: 8,
    totalWorkflows: 11,
    membersCount: 5,
    monthlyExecutions: '42,100 / 100,000',
    sla: '99.9%',
    region: 'eu-central-1 (Frankfurt)',
    createdAt: '2025-03-04T11:15:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'cyberflow_labs',
    name: 'CyberFlow Autonomous Labs',
    tier: 'ENTERPRISE',
    strategy: 'Dedicated Multi-DB Pool',
    strategyBadge: 'Dedicated DB Pool',
    database: 'tenant_cyberflow',
    isolationType: 'Physical Database Boundary',
    storage: '3.1 GB / 10 GB',
    activeWorkflows: 16,
    totalWorkflows: 19,
    membersCount: 8,
    monthlyExecutions: '289,000 / 1,000,000',
    sla: '99.99%',
    region: 'us-west-2 (Oregon)',
    createdAt: '2025-02-18T14:45:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'community_sandbox',
    name: 'Open Community Sandbox',
    tier: 'FREE',
    strategy: 'Discriminator Scoped Partition',
    strategyBadge: 'Shared Partition',
    database: 'workflow_platform',
    isolationType: 'Logical Scoped Collection',
    storage: '68 MB / 500 MB',
    activeWorkflows: 3,
    totalWorkflows: 4,
    membersCount: 2,
    monthlyExecutions: '3,400 / 10,000',
    sla: '99.5%',
    region: 'us-east-1 (N. Virginia)',
    createdAt: '2025-04-01T09:00:00Z',
    status: 'ACTIVE',
  },
];

export const MOCK_STATISTICS = {
  totalWorkflows: 48,
  activeWorkflows: 36,
  pausedWorkflows: 8,
  draftWorkflows: 4,
  totalExecutions: 482190,
  successfulExecutions: 467250,
  failedExecutions: 14940,
  successRate: 96.9,
  avgLatencyMs: 384,
  activeWorkers: 12,
  queuedJobs: 28,
  rateLimitUsage: '62%',
  
  // 7-day execution trends for Recharts
  executionTimeline: [
    { date: 'Mon', executions: 42300, success: 41100, failed: 1200, avgDurationMs: 370 },
    { date: 'Tue', executions: 58900, success: 57400, failed: 1500, avgDurationMs: 395 },
    { date: 'Wed', executions: 63200, success: 61800, failed: 1400, avgDurationMs: 410 },
    { date: 'Thu', executions: 71500, success: 69200, failed: 2300, avgDurationMs: 380 },
    { date: 'Fri', executions: 84100, success: 81300, failed: 2800, avgDurationMs: 425 },
    { date: 'Sat', executions: 36200, success: 35500, failed: 700, avgDurationMs: 340 },
    { date: 'Sun', executions: 31400, success: 30800, failed: 600, avgDurationMs: 335 },
  ],

  // Hourly trend for the last 24 hours
  hourlyTimeline: [
    { hour: '00:00', total: 1820, success: 1780, failed: 40 },
    { hour: '03:00', total: 1150, success: 1130, failed: 20 },
    { hour: '06:00', total: 2430, success: 2380, failed: 50 },
    { hour: '09:00', total: 5890, success: 5690, failed: 200 },
    { hour: '12:00', total: 7120, success: 6890, failed: 230 },
    { hour: '15:00', total: 6840, success: 6620, failed: 220 },
    { hour: '18:00', total: 5410, success: 5290, failed: 120 },
    { hour: '21:00', total: 3200, success: 3120, failed: 80 },
  ],

  // Distribution by node types
  nodeExecutionDistribution: [
    { name: 'API Request', value: 45, color: '#06b6d4' },
    { name: 'Task Runner', value: 25, color: '#6366f1' },
    { name: 'Conditions', value: 15, color: '#f59e0b' },
    { name: 'Loop Iterations', value: 10, color: '#f97316' },
    { name: 'Delay Timers', value: 5, color: '#a855f7' },
  ]
};

export const MOCK_TEMPLATES = [
  {
    id: 'template_ecommerce',
    name: 'E-Commerce Order Fulfillment & Fraud Check',
    description: 'Validates order payload, assesses credit risk score, triggers payment gateway, and routes to shipping.',
    category: 'E-Commerce',
    nodeCount: 7,
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 80, y: 180 },
        data: {
          label: 'Order Webhook',
          description: 'POST /v1/webhooks/orders',
          config: { triggerType: 'webhook', method: 'POST', endpoint: '/v1/webhooks/orders' }
        }
      },
      {
        id: 'api-validate',
        type: 'api',
        position: { x: 340, y: 180 },
        data: {
          label: 'Validate Inventory',
          description: 'Check stock with WMS API',
          config: {
            method: 'POST',
            url: 'https://inventory.api.acme.com/v1/stock/reserve',
            headers: '{"Authorization": "Bearer sk_wms_live"}',
            timeout: 3000
          }
        }
      },
      {
        id: 'cond-fraud',
        type: 'condition',
        position: { x: 620, y: 160 },
        data: {
          label: 'Fraud Score < 0.85?',
          description: 'Branch on high-risk transactions',
          config: {
            expression: 'payload.riskScore < 0.85 && payload.amount < 5000',
            description: 'Order amount and fraud rating check'
          }
        }
      },
      {
        id: 'task-payment',
        type: 'task',
        position: { x: 920, y: 80 },
        data: {
          label: 'Charge Credit Card',
          description: 'Invoke Stripe Payment Intent',
          config: {
            taskType: 'payment_charge',
            retryLimit: 3,
            timeout: 5000
          }
        }
      },
      {
        id: 'task-alert-sec',
        type: 'task',
        position: { x: 920, y: 300 },
        data: {
          label: 'Flag Fraud Review',
          description: 'Notify Security Ops Slack channel',
          config: {
            taskType: 'slack_alert',
            channel: '#security-fraud-alerts'
          }
        }
      },
      {
        id: 'end-success',
        type: 'end',
        position: { x: 1220, y: 80 },
        data: {
          label: 'Order Confirmed',
          description: 'Send receipt & dispatch shipment',
          config: { status: 'COMPLETED', emitEvent: 'order.fulfilled' }
        }
      },
      {
        id: 'end-rejected',
        type: 'end',
        position: { x: 1220, y: 300 },
        data: {
          label: 'Order Flagged',
          description: 'Payment blocked pending manual review',
          config: { status: 'FAILED', emitEvent: 'order.rejected' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'start-1', target: 'api-validate', animated: true },
      { id: 'e2-3', source: 'api-validate', target: 'cond-fraud', animated: true },
      { id: 'e3-4', source: 'cond-fraud', target: 'task-payment', sourceHandle: 'true', label: 'True (Approved)', style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e3-5', source: 'cond-fraud', target: 'task-alert-sec', sourceHandle: 'false', label: 'False (Flagged)', style: { stroke: '#ef4444', strokeWidth: 2 } },
      { id: 'e4-6', source: 'task-payment', target: 'end-success' },
      { id: 'e5-7', source: 'task-alert-sec', target: 'end-rejected' }
    ]
  },
  {
    id: 'template_batch_sync',
    name: 'Customer Sync & Data Enrichment Loop',
    description: 'Iterates through customer delta batch, enriches CRM attributes, and waits with a rate limit delay.',
    category: 'Data Pipeline',
    nodeCount: 6,
    nodes: [
      {
        id: 'start-cron',
        type: 'start',
        position: { x: 80, y: 150 },
        data: {
          label: 'Nightly Sync Cron',
          description: 'Schedule: 0 2 * * *',
          config: { triggerType: 'schedule', cron: '0 2 * * *' }
        }
      },
      {
        id: 'api-fetch',
        type: 'api',
        position: { x: 320, y: 150 },
        data: {
          label: 'Fetch CRM Records',
          description: 'GET /v2/customers/modified',
          config: { method: 'GET', url: 'https://api.crm.hubspot.com/v2/customers', timeout: 5000 }
        }
      },
      {
        id: 'loop-records',
        type: 'loop',
        position: { x: 580, y: 130 },
        data: {
          label: 'Process Batch',
          description: 'Iterate customer items',
          config: { maxIterations: 500, batchSize: 50, continueOnError: true }
        }
      },
      {
        id: 'delay-throttle',
        type: 'delay',
        position: { x: 840, y: 130 },
        data: {
          label: 'API Rate Throttler',
          description: 'Wait 250 milliseconds',
          config: { duration: 250, unit: 'milliseconds' }
        }
      },
      {
        id: 'task-upsert',
        type: 'task',
        position: { x: 1080, y: 130 },
        data: {
          label: 'Upsert Data Warehouse',
          description: 'Write to Snowflake BigQuery table',
          config: { taskType: 'sql_upsert', targetTable: 'dim_customers' }
        }
      },
      {
        id: 'end-sync',
        type: 'end',
        position: { x: 1320, y: 150 },
        data: {
          label: 'Sync Finished',
          description: 'Audit log logged to BigQuery',
          config: { status: 'COMPLETED' }
        }
      }
    ],
    edges: [
      { id: 'e-cron-fetch', source: 'start-cron', target: 'api-fetch' },
      { id: 'e-fetch-loop', source: 'api-fetch', target: 'loop-records' },
      { id: 'e-loop-delay', source: 'loop-records', target: 'delay-throttle' },
      { id: 'e-delay-task', source: 'delay-throttle', target: 'task-upsert' },
      { id: 'e-task-end', source: 'task-upsert', target: 'end-sync' }
    ]
  }
];

export const MOCK_WORKFLOWS = [
  {
    id: 'wf_ord_01',
    name: 'E-Commerce Order Fulfillment & Fraud Check',
    description: 'Validates order payload, assesses credit risk score, triggers payment gateway, and routes to shipping.',
    tenantId: 'acme_corp',
    status: 'ACTIVE',
    version: '1.4.0',
    triggerType: 'WEBHOOK',
    totalExecutions: 45210,
    successRate: 98.6,
    avgDurationMs: 412,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-05-10T14:22:00Z',
    lastExecutedAt: '2025-05-12T09:14:00Z',
    tags: ['e-commerce', 'stripe', 'fraud', 'critical'],
    nodes: MOCK_TEMPLATES[0].nodes,
    edges: MOCK_TEMPLATES[0].edges,
  },
  {
    id: 'wf_kyc_02',
    name: 'Multi-Tenant KYC Document Verification',
    description: 'Extracts ID documents with OCR AI, queries sanction databases, and issues tenant compliance certificates.',
    tenantId: 'acme_corp',
    status: 'ACTIVE',
    version: '2.1.0',
    triggerType: 'EVENT',
    totalExecutions: 18940,
    successRate: 94.2,
    avgDurationMs: 820,
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: '2025-05-09T18:00:00Z',
    lastExecutedAt: '2025-05-12T08:52:00Z',
    tags: ['fintech', 'ai-ocr', 'compliance'],
    nodes: MOCK_TEMPLATES[1].nodes,
    edges: MOCK_TEMPLATES[1].edges,
  },
  {
    id: 'wf_stripe_03',
    name: 'Real-Time Stripe Payment Webhook & Saga Compensations',
    description: 'Handles charge.succeeded, invoice.payment_failed with automatic Saga rollback and credit adjustments.',
    tenantId: 'zenith_ai',
    status: 'ACTIVE',
    version: '1.2.0',
    triggerType: 'WEBHOOK',
    totalExecutions: 89320,
    successRate: 99.1,
    avgDurationMs: 290,
    createdAt: '2025-02-14T09:30:00Z',
    updatedAt: '2025-05-11T16:10:00Z',
    lastExecutedAt: '2025-05-12T09:18:00Z',
    tags: ['payments', 'saga', 'stripe', 'billing'],
    nodes: MOCK_TEMPLATES[0].nodes,
    edges: MOCK_TEMPLATES[0].edges,
  },
  {
    id: 'wf_db_backup_04',
    name: 'Daily Database Partition Backup & Archival',
    description: 'Creates mongodump snapshot for dedicated tenant pool and uploads encrypted gzip to S3 Glacier.',
    tenantId: 'acme_corp',
    status: 'ACTIVE',
    version: '3.0.1',
    triggerType: 'SCHEDULE',
    totalExecutions: 1240,
    successRate: 100.0,
    avgDurationMs: 3420,
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-05-01T12:00:00Z',
    lastExecutedAt: '2025-05-12T02:00:00Z',
    tags: ['devops', 'backup', 's3', 'security'],
    nodes: MOCK_TEMPLATES[1].nodes,
    edges: MOCK_TEMPLATES[1].edges,
  },
  {
    id: 'wf_ai_support_05',
    name: 'AI Customer Support Sentiment & Routing Agent',
    description: 'Analyzes incoming Zendesk tickets via LLM, tags urgency, and auto-responds to tier-1 inquiries.',
    tenantId: 'cyberflow_labs',
    status: 'DRAFT',
    version: '0.9.0',
    triggerType: 'WEBHOOK',
    totalExecutions: 420,
    successRate: 91.5,
    avgDurationMs: 1450,
    createdAt: '2025-04-18T11:20:00Z',
    updatedAt: '2025-05-10T11:00:00Z',
    lastExecutedAt: '2025-05-11T20:30:00Z',
    tags: ['ai', 'zendesk', 'sentiment', 'draft'],
    nodes: MOCK_TEMPLATES[0].nodes,
    edges: MOCK_TEMPLATES[0].edges,
  },
  {
    id: 'wf_stock_06',
    name: 'High-Frequency Market Sentiment Ingestion',
    description: 'Polls financial news feeds every 5 minutes, normalizes ticker mentions, and triggers trading alerts.',
    tenantId: 'zenith_ai',
    status: 'PAUSED',
    version: '1.0.4',
    triggerType: 'SCHEDULE',
    totalExecutions: 29780,
    successRate: 88.4,
    avgDurationMs: 910,
    createdAt: '2025-03-10T14:00:00Z',
    updatedAt: '2025-05-08T09:40:00Z',
    lastExecutedAt: '2025-05-10T04:15:00Z',
    tags: ['finance', 'sentiment', 'paused'],
    nodes: MOCK_TEMPLATES[1].nodes,
    edges: MOCK_TEMPLATES[1].edges,
  }
];

export const MOCK_EXECUTIONS = [
  {
    id: 'exec_live_9f81a7b2',
    workflowId: 'wf_ord_01',
    workflowName: 'E-Commerce Order Fulfillment & Fraud Check',
    tenantId: 'acme_corp',
    tenantName: 'Acme Corporation',
    status: 'RUNNING',
    trigger: 'Webhook (POST /v1/orders)',
    startedAt: new Date(Date.now() - 3200).toISOString(),
    completedAt: null,
    durationMs: 3200,
    currentNode: 'cond-fraud',
    progress: 45,
    payload: {
      orderId: 'ORD-98231',
      customer: 'Sarah Jenkins',
      amount: 1420.50,
      currency: 'USD',
      riskScore: 0.12,
      items: [{ sku: 'MAC-M3-MAX', qty: 1, price: 1420.50 }]
    },
    timeline: [
      { step: 'Order Webhook', status: 'COMPLETED', duration: '12ms', timestamp: '10:14:01.020', message: 'Payload received & tenant context bound' },
      { step: 'Validate Inventory', status: 'COMPLETED', duration: '184ms', timestamp: '10:14:01.204', message: 'Stock reserved in Warehouse NYC-01' },
      { step: 'Fraud Score < 0.85?', status: 'RUNNING', duration: '64ms', timestamp: '10:14:01.268', message: 'Evaluating boolean condition (riskScore=0.12 < 0.85)' }
    ]
  },
  {
    id: 'exec_live_3c4d12e9',
    workflowId: 'wf_stripe_03',
    workflowName: 'Real-Time Stripe Payment Webhook & Saga Compensations',
    tenantId: 'zenith_ai',
    tenantName: 'Zenith AI Technologies',
    status: 'COMPLETED',
    trigger: 'Stripe Event (charge.succeeded)',
    startedAt: new Date(Date.now() - 45000).toISOString(),
    completedAt: new Date(Date.now() - 44620).toISOString(),
    durationMs: 380,
    currentNode: 'end-success',
    progress: 100,
    payload: {
      chargeId: 'ch_3N8zXvLkd',
      amount: 4900,
      currency: 'USD',
      customer: 'cus_Ob89v2',
      status: 'succeeded'
    },
    timeline: [
      { step: 'Webhook Ingress', status: 'COMPLETED', duration: '14ms', timestamp: '10:13:15.010', message: 'HMAC signature verified' },
      { step: 'Validate Customer Account', status: 'COMPLETED', duration: '95ms', timestamp: '10:13:15.105', message: 'Account status ACTIVE in MongoDB partition' },
      { step: 'Credit Allocation', status: 'COMPLETED', duration: '120ms', timestamp: '10:13:15.225', message: 'Added 5,000 API credits to tenant quota' },
      { step: 'Audit Record', status: 'COMPLETED', duration: '151ms', timestamp: '10:13:15.376', message: 'Transaction logged to immutable journal' }
    ]
  },
  {
    id: 'exec_live_7a8b9c0d',
    workflowId: 'wf_kyc_02',
    workflowName: 'Multi-Tenant KYC Document Verification',
    tenantId: 'acme_corp',
    tenantName: 'Acme Corporation',
    status: 'FAILED',
    trigger: 'Event (document.uploaded)',
    startedAt: new Date(Date.now() - 120000).toISOString(),
    completedAt: new Date(Date.now() - 118400).toISOString(),
    durationMs: 1600,
    currentNode: 'api-validate',
    progress: 33,
    error: {
      code: 'UPSTREAM_TIMEOUT',
      message: 'Passport OCR service failed to respond within 3000ms threshold.',
      failedNodeId: 'api-validate'
    },
    payload: {
      userId: 'usr_81726a',
      docType: 'PASSPORT_EU',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    timeline: [
      { step: 'Document Upload Event', status: 'COMPLETED', duration: '8ms', timestamp: '10:12:00.008', message: 'S3 presigned URL verified' },
      { step: 'Passport OCR API', status: 'FAILED', duration: '1592ms', timestamp: '10:12:01.600', message: 'Gateway Timeout (504): upstream service unreachable' }
    ]
  },
  {
    id: 'exec_live_55ab41cd',
    workflowId: 'wf_db_backup_04',
    workflowName: 'Daily Database Partition Backup & Archival',
    tenantId: 'acme_corp',
    tenantName: 'Acme Corporation',
    status: 'COMPLETED',
    trigger: 'Cron Schedule (0 2 * * *)',
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7196580).toISOString(),
    durationMs: 3420,
    currentNode: 'end-sync',
    progress: 100,
    payload: {
      database: 'tenant_acme_corp',
      collections: ['workflows', 'executions', 'audit_logs'],
      archiveSizeMb: 142.8
    },
    timeline: [
      { step: 'Schedule Trigger', status: 'COMPLETED', duration: '5ms', timestamp: '02:00:00.005', message: 'Cron dispatcher triggered job' },
      { step: 'Acquire Read Lock', status: 'COMPLETED', duration: '140ms', timestamp: '02:00:00.145', message: 'Consistent snapshot boundary established' },
      { step: 'Gzip Compression', status: 'COMPLETED', duration: '1820ms', timestamp: '02:00:01.965', message: 'Archived 142.8 MB snapshot' },
      { step: 'Upload S3 Glacier', status: 'COMPLETED', duration: '1455ms', timestamp: '02:00:03.420', message: 'Uploaded with KMS encryption (AES-256)' }
    ]
  },
  {
    id: 'exec_live_11fa990b',
    workflowId: 'wf_ai_support_05',
    workflowName: 'AI Customer Support Sentiment & Routing Agent',
    tenantId: 'cyberflow_labs',
    tenantName: 'CyberFlow Autonomous Labs',
    status: 'PAUSED',
    trigger: 'Webhook (Zendesk Ticket #4912)',
    startedAt: new Date(Date.now() - 400000).toISOString(),
    completedAt: null,
    durationMs: 890,
    currentNode: 'cond-fraud',
    progress: 60,
    payload: {
      ticketId: 'ZD-4912',
      customer: 'David Clark',
      subject: 'Critical billing discrepancy in March invoice',
      sentimentScore: -0.88,
      requiresHumanEscalation: true
    },
    timeline: [
      { step: 'Ticket Webhook', status: 'COMPLETED', duration: '16ms', timestamp: '10:05:00.016', message: 'Ticket body extracted' },
      { step: 'LLM Sentiment Inference', status: 'COMPLETED', duration: '620ms', timestamp: '10:05:00.636', message: 'Sentiment score: -0.88 (Angry)' },
      { step: 'Human Approval Gate', status: 'PAUSED', duration: '254ms', timestamp: '10:05:00.890', message: 'Awaiting support manager manual approval' }
    ]
  },
  {
    id: 'exec_live_8899aabb',
    workflowId: 'wf_ord_01',
    workflowName: 'E-Commerce Order Fulfillment & Fraud Check',
    tenantId: 'acme_corp',
    tenantName: 'Acme Corporation',
    status: 'CANCELLED',
    trigger: 'Manual API Trigger',
    startedAt: new Date(Date.now() - 900000).toISOString(),
    completedAt: new Date(Date.now() - 898000).toISOString(),
    durationMs: 2000,
    currentNode: 'task-payment',
    progress: 50,
    payload: {
      orderId: 'ORD-TEST-999',
      cancelledBy: 'admin@acme.com',
      reason: 'Aborted by operator via dashboard UI'
    },
    timeline: [
      { step: 'Manual Start', status: 'COMPLETED', duration: '4ms', timestamp: '09:55:00.004', message: 'Triggered from developer canvas' },
      { step: 'Validation Step', status: 'COMPLETED', duration: '110ms', timestamp: '09:55:00.114', message: 'Mock parameters passed' },
      { step: 'Payment Node', status: 'CANCELLED', duration: '1886ms', timestamp: '09:55:02.000', message: 'Execution cancelled by user' }
    ]
  }
];

export const MOCK_API_KEYS = [
  {
    id: 'key_live_01',
    name: 'Production Worker Daemon',
    prefix: 'wk_live_acme_',
    keyMasked: 'wk_live_acme_4a91••••••••••••7c2e',
    fullKey: 'wk_live_acme_4a91b2c3d4e5f60718293a4b5c6d7e8f.7c2e',
    tenantId: 'acme_corp',
    scopes: ['workflows:read', 'workflows:write', 'workflows:execute'],
    status: 'ACTIVE',
    createdAt: '2025-01-15T09:00:00Z',
    lastUsedAt: '2 minutes ago',
    usageCount: 142980,
    environment: 'production'
  },
  {
    id: 'key_live_02',
    name: 'CI/CD GitHub Actions Pipeline',
    prefix: 'wk_live_acme_',
    keyMasked: 'wk_live_acme_99b0••••••••••••11a4',
    fullKey: 'wk_live_acme_99b0123456789abcdef0123456789abc.11a4',
    tenantId: 'acme_corp',
    scopes: ['workflows:read', 'workflows:write'],
    status: 'ACTIVE',
    createdAt: '2025-02-10T14:30:00Z',
    lastUsedAt: '4 hours ago',
    usageCount: 840,
    environment: 'staging'
  },
  {
    id: 'key_live_03',
    name: 'Legacy Microservice Gateway',
    prefix: 'wk_live_acme_',
    keyMasked: 'wk_live_acme_1122••••••••••••9988',
    fullKey: 'wk_live_acme_11223344556677889900aabbccddeeff.9988',
    tenantId: 'acme_corp',
    scopes: ['workflows:execute'],
    status: 'REVOKED',
    createdAt: '2024-11-01T10:00:00Z',
    lastUsedAt: '34 days ago',
    usageCount: 52100,
    environment: 'production'
  },
  {
    id: 'key_live_04',
    name: 'External Webhook Dispatcher',
    prefix: 'wk_live_acme_',
    keyMasked: 'wk_live_acme_88aa••••••••••••44cc',
    fullKey: 'wk_live_acme_88aabbccddeeff001122334455667788.44cc',
    tenantId: 'acme_corp',
    scopes: ['workflows:execute'],
    status: 'ACTIVE',
    createdAt: '2025-04-12T16:20:00Z',
    lastUsedAt: '12 minutes ago',
    usageCount: 9410,
    environment: 'production'
  }
];

export const MOCK_TEAM_MEMBERS = [
  {
    id: 'usr_01',
    name: 'Alex Morgan',
    email: 'alex.morgan@acme.com',
    role: 'Owner',
    avatarBg: 'bg-indigo-600',
    initials: 'AM',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    joinedDate: '2024-10-15',
    lastActive: 'Just now'
  },
  {
    id: 'usr_02',
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.com',
    role: 'Admin',
    avatarBg: 'bg-emerald-600',
    initials: 'ER',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    joinedDate: '2024-11-20',
    lastActive: '15 mins ago'
  },
  {
    id: 'usr_03',
    name: 'Liam Chen',
    email: 'liam.chen@acme.com',
    role: 'Developer',
    avatarBg: 'bg-cyan-600',
    initials: 'LC',
    status: 'ACTIVE',
    twoFactorEnabled: false,
    joinedDate: '2025-01-08',
    lastActive: '2 hours ago'
  },
  {
    id: 'usr_04',
    name: 'Devon Vance',
    email: 'devon.vance@acme.com',
    role: 'Developer',
    avatarBg: 'bg-amber-600',
    initials: 'DV',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    joinedDate: '2025-02-14',
    lastActive: 'Yesterday'
  },
  {
    id: 'usr_05',
    name: 'Sophia Patel',
    email: 'sophia.patel@external-audit.io',
    role: 'Viewer',
    avatarBg: 'bg-purple-600',
    initials: 'SP',
    status: 'INVITED',
    twoFactorEnabled: false,
    joinedDate: '2025-05-10',
    lastActive: 'Pending Invite'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_01',
    title: 'Workflow Execution Spike',
    description: 'E-Commerce Order Fulfillment reached 1,200 req/min (+45% above threshold).',
    type: 'WARNING',
    timestamp: '5m ago',
    read: false,
  },
  {
    id: 'notif_02',
    title: 'API Upstream Timeout',
    description: 'KYC Document Verification execution #exec_live_7a8b9c0d failed on node "api-validate".',
    type: 'ERROR',
    timestamp: '18m ago',
    read: false,
  },
  {
    id: 'notif_03',
    title: 'New API Key Generated',
    description: 'Elena Rostova generated "External Webhook Dispatcher" key.',
    type: 'INFO',
    timestamp: '2h ago',
    read: true,
  },
  {
    id: 'notif_04',
    title: 'Database Backup Completed',
    description: 'Dedicated partition tenant_acme_corp successfully archived to S3 Glacier.',
    type: 'SUCCESS',
    timestamp: '7h ago',
    read: true,
  }
];
