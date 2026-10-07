// Same steps as the approved Mermaid diagram in github-profile/README.md.
// lane = column (0 = main path), row = step order from top to bottom.
export default {
  title: 'Metadata-driven file migration flow',
  description:
    'SQL Server file metadata is read as JSON attributes; each file is fetched from the source repository and checked by Python for corruption or encryption. Rejected files go to the error log. Valid files get a SHA-256 hash in NiFi and are copied to Isilon renamed by file ID. If the hash and name match, the result is written to the audit log; otherwise the file enters a retry queue with a maximum number of attempts, and goes to the error log when the limit is reached.',
  lanes: 2,
  nodes: [
    { id: 'A', lines: ['SQL Server', 'file metadata'], kind: 'store', lane: 0, row: 0 },
    { id: 'B', lines: ['Read file specs', 'as JSON attributes'], lane: 0, row: 1 },
    { id: 'C', lines: ['Fetch file from', 'source repository'], lane: 0, row: 2 },
    { id: 'D', lines: ['Python check:', 'corrupted or', 'encrypted?'], kind: 'decision', lane: 0, row: 3 },
    { id: 'Z', lines: ['Error log', 'status: error,', 'for review'], kind: 'error-store', lane: 1, row: 3 },
    { id: 'E', lines: ['Compute SHA-256', 'in NiFi'], lane: 0, row: 4 },
    { id: 'F', lines: ['Copy to Isilon', 'renamed by file ID'], lane: 0, row: 5 },
    { id: 'R', lines: ['Retry queue', 'max N attempts'], kind: 'warn', lane: 1, row: 5 },
    { id: 'G', lines: ['Hash match and', 'name verified?'], kind: 'decision', lane: 0, row: 6 },
    { id: 'H', lines: ['Audit log', 'hash, size,', 'validations'], kind: 'store', lane: 0, row: 7 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'Z', label: 'yes', tone: 'error' },
    { from: 'D', to: 'E', label: 'no' },
    { from: 'E', to: 'F' },
    { from: 'F', to: 'G' },
    { from: 'G', to: 'R', label: 'no', tone: 'warn' },
    { from: 'R', to: 'F', label: 'retry', tone: 'warn' },
    { from: 'R', to: 'Z', label: 'limit reached', tone: 'error' },
    { from: 'G', to: 'H', label: 'yes' },
  ],
}
