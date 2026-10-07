// Same steps as the approved Mermaid diagram in github-profile/README.md.
export default {
  title: 'OftaData clinical data flow',
  description:
    'Reception registers the visit, the doctor completes the consultation form and uploads images or scanned documents. Inside the Azure VM, the Go backend compresses and optimizes images and stores them on the VM disk, and stores patients, forms and image paths in PostgreSQL. Daily backups cover both the database and the images.',
  lanes: 2,
  nodes: [
    { id: 'A', lines: ['Reception', 'registers visit'], kind: 'source', lane: 0, row: 0 },
    { id: 'B', lines: ['Doctor completes', 'consultation form'], lane: 0, row: 1 },
    { id: 'C', lines: ['Upload images or', 'scanned documents'], lane: 0, row: 2 },
    { id: 'D', lines: ['Go backend'], kind: 'accent', lane: 0, row: 3 },
    { id: 'E', lines: ['Compress and', 'optimize images'], lane: 0, row: 4 },
    { id: 'G', lines: ['PostgreSQL', 'patients, forms,', 'image paths'], kind: 'store', lane: 1, row: 4 },
    { id: 'F', lines: ['VM disk', 'image files'], kind: 'store', lane: 0, row: 5 },
    { id: 'H', lines: ['Daily backups', 'database + images'], kind: 'warn', lane: 1, row: 5 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'D', to: 'G' },
    { from: 'F', to: 'H', dashed: true },
    { from: 'G', to: 'H', dashed: true },
  ],
  groups: [{ label: 'Azure VM', lanes: [0, 1], rows: [3, 5] }],
}
