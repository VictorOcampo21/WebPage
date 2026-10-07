// Planned architecture from docs/lakehouse-project_v2.md (section 3).
export default {
  title: 'Planned medallion lakehouse flow',
  description:
    'A Python generator produces synthetic XML invoices in a Unity Catalog landing volume. Auto Loader ingests them incrementally into Bronze. Silver parses invoices and line items and sends rows that fail data quality rules to a quarantine table with the reason. Gold models a star schema with KPIs that feed a Databricks SQL dashboard.',
  lanes: 2,
  nodes: [
    { id: 'A', lines: ['Python generator', 'synthetic XML', 'invoices'], kind: 'source', lane: 0, row: 0 },
    { id: 'B', lines: ['Landing volume', '(Unity Catalog)'], kind: 'store', lane: 0, row: 1 },
    { id: 'C', lines: ['Bronze', 'raw XML + metadata'], kind: 'bronze', lane: 0, row: 2 },
    { id: 'D', lines: ['Silver', 'invoices + lines'], kind: 'silver', lane: 0, row: 3 },
    { id: 'Q', lines: ['Quarantine', 'rows that fail DQ', 'rules + reason'], kind: 'error', lane: 1, row: 3 },
    { id: 'E', lines: ['Gold', 'star schema + KPIs'], kind: 'gold', lane: 0, row: 4 },
    { id: 'F', lines: ['Databricks SQL', 'dashboard'], kind: 'sink', lane: 0, row: 5 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C', label: 'Auto Loader' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'Q', tone: 'error' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
  ],
}
