// Views of the terminal portfolio: order, commands and shortcuts.
// Text content lives in profile.js; this file only defines navigation.

export const sections = [
  { id: 'about', label: 'about', cmd: 'cat about.md', title: 'About', key: '1' },
  { id: 'projects', label: 'projects', cmd: './projects --flows', title: 'Projects', key: '2', featured: true },
  { id: 'experience', label: 'experience', cmd: 'git log --career', title: 'Experience', key: '3' },
  { id: 'education', label: 'education', cmd: 'cat education.md', title: 'Education', key: '4' },
  { id: 'skills', label: 'skills', cmd: 'cat skills.json', title: 'Skills', key: '5' },
  { id: 'certifications', label: 'certifications', cmd: 'ls -l ./certifications', title: 'Certifications', key: '6' },
  { id: 'contact', label: 'contact', cmd: './contact.sh', title: 'Contact', key: '7' },
]

export const home = { id: 'home', label: 'map', cmd: 'whoami && ./portfolio --map', title: 'Home' }
export const plain = { id: 'plain', label: 'plain', cmd: './portfolio --plain', title: 'Plain document' }

export const views = Object.fromEntries([home, plain, ...sections].map((v) => [v.id, v]))

// Words the prompt accepts for each view (first one is shown in `help`).
export const aliases = {
  home: ['map', 'home', 'ls', 'clear', 'whoami', 'cd', 'cd ~'],
  plain: ['plain', '--plain', 'print'],
  about: ['about', 'cat about.md'],
  projects: ['projects', './projects', './projects --flows', 'flows'],
  experience: ['experience', 'exp', 'git log', 'git log --career'],
  education: ['education', 'edu', 'cat education.md'],
  skills: ['skills', 'cat skills.json'],
  certifications: ['certs', 'certifications', 'ls -l ./certifications'],
  contact: ['contact', './contact.sh'],
}
