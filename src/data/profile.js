// All website content lives here. Edit this file when the CV changes.
// Source of truth: cv/Victor_Ocampo_Marin_Data_Engineer_v6.tex and docs/master-resume.md.
// Flow diagrams live in src/diagrams/ (one file per project).

export const profile = {
  name: 'Victor Ocampo Marin',
  role: 'Data Engineer',
  location: 'Costa Rica',
  // Shown under the name on the home screen. Must match the CV and LinkedIn headline.
  title: 'Data Engineer · SQL Server, ETL & Apache NiFi',
  tagline:
    'I build data-intensive systems with SQL Server, ETL (SSIS, Apache NiFi) and Python.',

  // "by_the_numbers" table in About. Only confirmed facts (docs/master-resume.md); never estimate.
  stats: [
    { value: 5, suffix: '', label: 'years building software and data systems' },
    { value: 3, suffix: '', label: 'concurrent client data projects' },
    { value: 1000, suffix: '+', label: 'patient forms centralized across 5 clinics' },
    { value: 60, suffix: '%', label: 'less HR request processing time (500+ employees)' },
  ],

  // "now" list in About (from the GitHub profile README).
  now: [
    'Data development across three concurrent client projects: data ingestion, file migration and SSIS modernization.',
    'Designing and building the Apache NiFi flows for two of them.',
    'Training in Databricks, PySpark and Microsoft Fabric; starting a personal Databricks lakehouse project.',
  ],

  // Served from public/. Replace the file there and update the name here when the CV changes.
  cvFile: 'Victor_Ocampo_Marin_Data_Engineer_v6.pdf',

  links: {
    email: 'victorocampomarin21@gmail.com',
    linkedin: 'https://www.linkedin.com/in/victor-ocampo-marin-69466122b',
    github: 'https://github.com/VictorOcampo21',
  },

  about: [
    "I'm a Data Engineer with a 5-year background in software and data engineering, building data-intensive systems with SQL Server, ETL (SSIS, Apache NiFi) and Python.",
    "Today I'm responsible for data development across three concurrent client projects at a data outsourcing firm: data ingestion, file migration and SSIS modernization. I design and build the Apache NiFi flows for two of them.",
    'Before data engineering I was a full stack engineer (C#/.NET, Go, Vue.js, Django), so I care about the whole path: from the source system to the person reading the dashboard. I am used to explaining technical work to non-technical users.',
    "I'm currently training in Databricks, PySpark and Microsoft Fabric, and starting a personal Databricks lakehouse project.",
  ],

  experience: [
    {
      title: 'Data Engineer',
      company: 'Martinexsa',
      dates: 'May 2026 – Present',
      location: 'Costa Rica',
      bullets: [
        'Principal data developer for two government judicial entities; sole builder of all their Apache NiFi flows.',
        'Built a metadata-driven file migration pipeline to Isilon storage with NiFi, Python, and SQL Server: a metadata table drives each transfer, and files are renamed by file ID and verified by Python scripts.',
        'Ensured end-to-end integrity: rejects corrupted or encrypted files, verifies SHA-256 hashes at the destination, retries failed transfers up to a limit, and logs every result and error to SQL Server audit tables.',
        'Build a NiFi log ingestion flow that loads application logs from multiple virtual machines into a database the analytics team uses to feed an AI support agent.',
        'Modernize legacy SSIS ETL and SQL processes for a regional financial institution in a 5-person team: adapt existing packages to new tables and servers, troubleshoot incremental loads, and resolve data tickets.',
      ],
      tags: ['Apache NiFi', 'Python', 'SQL Server', 'Isilon', 'SSIS'],
    },
    {
      title: 'Full Stack Engineer',
      company: 'Freelance',
      dates: 'May 2025 – Apr 2026',
      location: 'Costa Rica',
      bullets: [
        'FactuBot: built a Python (Django) ETL bot for multiple accountants that pulls XML invoices from Gmail on a schedule, deduplicates and validates them against Costa Rica tax authority (Hacienda) rules, routes failures to an error queue, and loads Azure Database for PostgreSQL for VAT and P&L KPIs.',
        'OftaData: gathered requirements with the doctor and trained staff; designed the PostgreSQL database, Go backend, Vue.js frontend, and Azure deployment (VM, networking, firewall, SSL) of a system centralizing 1,000+ patient forms with medical images across 5 clinics; daily database and image backups (7-day retention) restored data after real incidents.',
      ],
      tags: ['Python', 'Django', 'PostgreSQL', 'Go', 'Vue.js', 'Azure'],
    },
    {
      title: 'RPA Developer II',
      company: 'World Kinect',
      dates: 'Jan 2025 – Apr 2025',
      location: 'Remote',
      bullets: [
        'Built Python and C# automation blocks to extract invoice data from PDFs (OCR) into a financial system.',
        'Owned the migration of a high-volume daily fuel invoice process from UiPath to Power Automate.',
        'Monitored production workflows and Azure DevOps pipeline runs triggered from Power Apps, reviewing logs and resolving failures; built quarterly reports in Power BI.',
        'Led C# code reviews for an 8-person team; secondary technical lead supporting developers on Power Apps.',
      ],
      tags: ['Python', 'C#', 'UiPath', 'Power Automate', 'Azure DevOps', 'Power BI'],
    },
    {
      title: 'Fullstack Engineer',
      company: 'GBSYS',
      dates: 'Jan 2023 – Sep 2024',
      location: 'Costa Rica',
      bullets: [
        'Developed complex SQL Server queries, stored procedures, views, and temporary tables for transactional modules and financial reporting (SSRS), tuning performance through indexing, query optimization, and execution plan analysis.',
        'Designed relational schemas for banking and government systems built with C# and .NET MVC, and led the migration of a 10+ year-old Oracle Forms application to Oracle APEX, delivered ahead of schedule.',
      ],
      tags: ['SQL Server', 'SSRS', 'C#', '.NET MVC', 'Oracle APEX'],
    },
    {
      title: 'Project Lead, Developer & Scrum Master',
      company: 'FUNDAUNA – Universidad Nacional',
      dates: 'Jan 2021 – Jun 2022',
      location: 'Costa Rica',
      bullets: [
        'Digitized HR processes for 500+ employees (Java, Spring Boot, PostgreSQL), cutting request processing time by 60%.',
      ],
      tags: ['Java', 'Spring Boot', 'PostgreSQL'],
    },
  ],

  education: {
    school: 'Universidad Nacional',
    degree: "Bachelor's Degree in Information Systems Engineering",
    dates: 'Jan 2019 – Jul 2023',
    location: 'Costa Rica',
  },

  projectsIntro:
    'Most of my production work belongs to clients or organizations and its source code is private. Here is what I built, described without confidential details.',

  // `diagram` must match a file name in src/diagrams/ (without .js).
  // status: 'done' (no badge) | 'in-progress' | 'coming-soon'
  projects: [
    {
      id: 'nifi-migration',
      title: 'Metadata-driven file migration with integrity checks',
      kind: 'Client project',
      status: 'done',
      stack: ['Apache NiFi', 'Python', 'SQL Server', 'Isilon'],
      summary:
        'Client project for a government judicial entity; details generalized for confidentiality. A NiFi flow migrates documents from source file repositories to Isilon storage, driven by a SQL Server metadata table that holds each file’s specifications and location.',
      bullets: [
        ['Validation', 'Python scripts detect corrupted or encrypted files (PDF and other formats), which are not allowed in the flow.'],
        ['Correct naming', 'files are renamed by their file ID, and a Python script verifies the renaming.'],
        ['Integrity check', 'SHA-256 hash computed in NiFi at the source and verified at the destination.'],
        ['Resilience', 'failed transfers go to a retry queue capped at a maximum number of attempts.'],
        ['Error handling', 'every file that fails a check (corrupted, encrypted, or out of retries) is logged to an error table with an error status, so the client can review it and decide whether to re-fetch it from the source or discard it.'],
        ['Traceability', 'hash, size and validation results are written to SQL Server audit tables.'],
      ],
      // "Why" tab. Each line must be confirmed by Victor before publishing.
      decisions: [
        ['Why metadata-driven', 'each file\u2019s specifications and location live in a SQL Server table, so the flow is driven by data instead of hard-coded paths, and every file stays traceable by its ID from the source to Isilon.'],
        ['Why hash at both ends', 'computing SHA-256 before the copy and verifying it at the destination proves the file arrived intact, not just that the copy step finished; the hash is kept in the audit log as evidence.'],
        ['Why cap the retries', 'failed transfers get another chance, but a limit keeps one bad file from looping forever; files out of retries get an error status so the client decides whether to re-fetch or discard them.'],
      ],
      diagram: 'nifiMigration',
      repo: null,
    },
    {
      id: 'factubot',
      title: 'FactuBot',
      kind: 'ETL bot for electronic invoices',
      status: 'done',
      stack: ['Python', 'Django', 'Gmail API', 'Azure Database for PostgreSQL'],
      summary:
        'ETL bot used by multiple accountants, installed on each user’s computer and backed by Azure Database for PostgreSQL. It collects electronic invoices from email, validates them against the requirements of Costa Rica’s tax authority (Hacienda) and turns them into tax and sales KPIs.',
      bullets: [
        ['Scheduled ingestion', 'checks Gmail through the Gmail API daily by default, with a user-configurable schedule.'],
        ['No duplicates', 'queue-based processing keyed on each invoice’s unique identifier; once processed, an XML is never picked up again.'],
        ['Validation', 'every mandatory field of Hacienda’s XML structure, plus the presence of Hacienda’s acceptance message for each invoice. Invoices that fail go to an error queue for review.'],
        ['Data model', 'Azure Database for PostgreSQL with separate header and line-item tables, so multi-line invoices are stored at line level.'],
        ['KPIs', 'VAT and other taxes, profit and loss, and top-selling items by category when the invoice includes one.'],
      ],
      diagram: 'factubot',
      repo: null,
    },
    {
      id: 'oftadata',
      title: 'OftaData',
      kind: 'Multi-clinic patient records system',
      status: 'done',
      stack: ['Go', 'Vue.js', 'PostgreSQL', 'Azure', 'Nginx'],
      summary:
        'Built end to end for an ophthalmologist who works across five clinics in Costa Rica: database, backend, frontend and deployment. It centralizes every patient from every clinic in one system (1,000+ patient forms with medical images), used daily by the doctor and the reception staff.',
      bullets: [
        ['Clinical workflow', 'reception registers the patient or their arrival and opens the visit form; the doctor completes it during the consultation and attaches images or scanned paper documents.'],
        ['Data model', 'each patient has a profile, a clinical history (consultation forms) and a surgical history (signed surgery forms).'],
        ['Images', 'uploaded from the browser, compressed and optimized, stored on the VM’s disk, with their paths kept in PostgreSQL.'],
        ['Backups', 'daily automated backups of the database and the images with 7-day retention, already used to restore data after real incidents.'],
        ['Security', 'role-based access, HTTPS with an SSL certificate, firewall and network rules on Azure, and controlled SSH access.'],
        ['Appointments', 'appointment calendar with WhatsApp reminders to patients.'],
      ],
      diagram: 'oftadata',
      repo: null,
    },
    {
      id: 'lakehouse',
      title: 'CR e-invoice Lakehouse',
      kind: 'Personal project',
      // Change to 'in-progress' and list finished phases once they are published in the repo.
      status: 'coming-soon',
      stack: ['Databricks', 'PySpark', 'Delta Lake', 'Unity Catalog'],
      summary:
        'A Databricks lakehouse that will ingest synthetic Costa Rican electronic invoices (XML) and process them through a medallion architecture (Bronze → Silver → Gold) with PySpark: incremental ingestion with Auto Loader, data quality rules with a quarantine table, and a star schema for business KPIs. All data is synthetic.',
      bullets: [],
      // "Done so far" bullets (max 3). Only what is finished in the repo; it has not been run on a Databricks workspace yet.
      phasesDone: [
        'Medallion design (Bronze, Silver, Gold) documented as ADRs: Delta Lake, Auto Loader, quarantine of invalid records.',
        'Reproducible synthetic invoice generator with controlled data quality errors.',
        'Unit-tested PySpark data quality rules and CI with GitHub Actions (lint and tests).',
      ],
      diagram: 'lakehouse',
      repo: 'https://github.com/VictorOcampo21/datalakehouse-practice',
    },
  ],

  otherWork: {
    title: 'Other client data projects',
    items: [
      'Log ingestion flow (in progress) for a government judicial entity: Apache NiFi collects application logs from multiple virtual machines, extracts the key fields and loads them into a database that the analytics team uses to feed KPIs to an AI support agent.',
      'Modernization of legacy SSIS ETL and SQL processes for a regional financial institution, within a five-person data team: adapting existing packages to new tables and servers, troubleshooting incremental loads and resolving data tickets.',
    ],
  },

  skills: [
    { group: 'Data Engineering', items: ['ETL/ELT', 'Data Pipelines', 'Data Ingestion', 'Data Modeling', 'Data Warehousing', 'Data Quality'] },
    { group: 'Data Tools & Platforms', items: ['SSIS', 'Apache NiFi', 'SSRS', 'Snowflake', 'Power BI'] },
    { group: 'Databases & Storage', items: ['SQL Server (T-SQL)', 'PostgreSQL', 'MySQL', 'Isilon'] },
    { group: 'Programming', items: ['SQL', 'Python', 'C#', 'Go', 'JavaScript'] },
    { group: 'Cloud & DevOps', items: ['Microsoft Azure (VMs, Azure Database for PostgreSQL, Networking, Nginx)', 'Git', 'Linux'] },
    { group: 'Languages', items: ['Spanish (Native)', 'English (B2+, Professional Working Proficiency)'] },
  ],

  // Shown apart from the skills above, marked "In training" (CV v6).
  training: ['Databricks', 'PySpark', 'Microsoft Fabric'],

  certifications: [
    {
      name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
      issuer: 'Microsoft',
      date: 'Aug 2023',
      url: 'https://learn.microsoft.com/es-mx/users/victormarin-8450/credentials/7c36f512f6349db9',
    },
    {
      name: 'Oracle APEX Cloud Developer Certified Professional',
      issuer: 'Oracle',
      date: 'Mar 2024',
      url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=48671B17B024B2A35CF7ED80C73E3FB2B38FF3BC221E991F5590BA8FC01C1BF1',
    },
    {
      name: 'Certified Scrum Master',
      issuer: 'International Scrum Institute',
      date: 'Jan 2023',
      url: 'https://www.scrum-institute.org/certifications/Scrum-Institute.Org-SMACea023cafa7-87462744894437.pdf',
    },
  ],

  contact: {
    text: 'Open to Data Engineer opportunities (remote, hybrid or on-site). Reach me by email or on LinkedIn.',
  },
}
