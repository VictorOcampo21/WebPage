// Same steps as the approved Mermaid diagram in github-profile/README.md.
export default {
  title: 'FactuBot invoice ETL flow',
  description:
    'A scheduled Gmail API check downloads invoice XML files. Already processed invoices are skipped. Invoices missing mandatory fields or the Hacienda acceptance message go to an error queue for review. Valid invoices are loaded into PostgreSQL as header and line items and feed a KPI dashboard with VAT, taxes, profit and loss, and top sellers.',
  lanes: 2,
  nodes: [
    { id: 'A', lines: ['Gmail API', 'scheduled check'], kind: 'source', lane: 0, row: 0 },
    { id: 'B', lines: ['Download XML'], lane: 0, row: 1 },
    { id: 'C', lines: ['Already', 'processed?'], kind: 'decision', lane: 0, row: 2 },
    { id: 'S', lines: ['Skip'], kind: 'muted', lane: 1, row: 2 },
    { id: 'D', lines: ['Mandatory fields +', 'Hacienda acceptance', 'message present?'], kind: 'decision', lane: 0, row: 3 },
    { id: 'Q', lines: ['Error queue', 'for review'], kind: 'error', lane: 1, row: 3 },
    { id: 'E', lines: ['PostgreSQL', 'header + line items'], kind: 'store', lane: 0, row: 4 },
    { id: 'F', lines: ['KPI dashboard', 'VAT, taxes, P&L,', 'top sellers'], kind: 'sink', lane: 0, row: 5 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'S', label: 'yes', tone: 'muted' },
    { from: 'C', to: 'D', label: 'no' },
    { from: 'D', to: 'Q', label: 'no', tone: 'error' },
    { from: 'D', to: 'E', label: 'yes' },
    { from: 'E', to: 'F' },
  ],
}
