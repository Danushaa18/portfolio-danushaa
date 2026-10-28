/**
 * Single source of truth for everything the site says.
 * All copy is taken from Danushaa's resume (Oct 2026).
 *
 * CONFIGURE ME:
 *  - links.github             → your GitHub profile URL
 *  - projects[].links         → live / repository URLs you want public
 *  - portrait.src             → put your photo in /public and set e.g. "/portrait.jpg"
 *  - contact.showPhone        → true if you want your phone number in the footer
 *
 * Anything left as null is simply not rendered in production builds.
 * In development a dashed placeholder marks each missing value.
 */

export type Link = { label: string; href: string };

export const site = {
  name: "Danushaa M S",
  firstName: "Danushaa",
  initials: "M S",
  role: "Full stack developer",
  location: "Tamil Nadu, India",
  summary:
    "Full stack developer who started out writing control and calibration software for industrial measurement machines, and now builds CRMs, HRMS and finance systems for teams that run on them.",

  portrait: {
    // e.g. "/portrait.jpg" (place the file in /public). null shows a marked placeholder.
    src: "/image-danu.png" as string | null,
    alt: "Portrait of Danushaa M S",
    // Optional: CSS object-position to art-direct the crop, e.g. "50% 20%".
    focus: "50% 25%",
  },

  contact: {
    email: "msdanu03@gmail.com",
    phone: "+91 9787505558",
    showPhone: false,
  },

  links: {
    linkedin: "https://www.linkedin.com/in/danushaa-ms/" as string | null,
    // CONFIGURE: your GitHub profile, e.g. "https://github.com/your-handle"
    github: null as string | null,
  },

  education: {
    school: "Sri Shakthi Institute of Engineering and Technology",
    degree: "Bachelor of Engineering in Electronics and Communication",
    years: "2020 – 2024",
    grade: "CGPA 8.4",
    place: "Tamil Nadu",
  },

  /** Chronological: the story runs from the first role to the current one. */
  experience: [
    {
      start: "June 2023",
      end: "June 2024",
      company: "Zentron Labs",
      role: "Software development intern",
      points: [
        "Built JSON-based data conversion tools in Python so automation modules and backends could talk to each other, with 99.9% data accuracy.",
        "Ran functional testing before product launch and caught critical bugs, improving system stability by 15%.",
      ],
    },
    {
      start: "June 2024",
      end: "Sept 2025",
      company: "Zentron Lab Pvt. Ltd",
      role: "Software developer",
      points: [
        "Redesigned the Top-Light feature for Instant Measurement Machines in Figma and Python, improving operator workflow efficiency by 25%.",
        "Built Servo and Save-As functionality and optimised data storage, cutting task execution time by 30%.",
        "Wrote calibration and diagnostic utilities that validate sensor accuracy across IMM units, reducing manual calibration time by 20%.",
        "Worked with hardware and electronics engineers to connect control software to servo motors and sensor modules.",
      ],
    },
    {
      start: "Feb 2026",
      end: "Oct 2026",
      company: "Nelgates Technologies",
      role: "Software developer",
      points: [
        "Led full-cycle development of eCommerce platforms and CRM systems, increasing client operational efficiency by 20%.",
        "Led a team of UI/UX designers and developers: sprints, design handoffs, client meetings and requirement gathering.",
        "Built WordPress and Elementor sites with on-page SEO and PWA support, cutting page load times by 40% with custom PHP and CSS.",
        "Designed an HRMS that reduced manual entry by 35%, and a billing system that cut invoice errors by 15%.",
      ],
    },
    {
      start: "Oct 2026",
      end: "Present",
      company: "Growth Graph Media",
      role: "Full stack developer",
      points: [
        "Building GGM-CRM in Next.js and Supabase: sales, HRMS and Meta Ads / Google Ads performance in one system.",
        "Developing analytics and reporting across clients, campaigns, leads, creatives, social and landing pages.",
        "Building finance and HRMS modules, plus role-based access, scorecards and goals & KPI tracking.",
      ],
    },
  ],

  projects: [
    {
      id: "ggm-crm",
      title: "GGM-CRM",
      context: "Growth Graph Media, in progress",
      problem:
        "Sales, people operations and ad performance lived in separate places, so nobody had one view of a client, a campaign or a team.",
      solution:
        "A unified CRM that pulls sales, HRMS and Meta Ads / Google Ads data into a single system for managing clients, campaigns and teams.",
      contribution: [
        "Marketing analytics and reporting: client, campaign, lead, creative, social and landing page performance",
        "Finance: invoices, payments, expenses, revenue and client billing",
        "HRMS: employees, attendance and leave, payroll, salary structure",
        "Role-based access, performance scorecards, evaluations, goals & KPIs",
      ],
      stack: ["Next.js", "Supabase"],
      links: [] as Link[],
      visual: "hub" as const,
    },
    {
      id: "limestone",
      title: "Limestone",
      context: "Construction site management",
      problem:
        "Site operations, worker attendance and material procurement needed one place to be tracked, with site photos and documents stored safely.",
      solution:
        "A site management platform covering operations, attendance and procurement, with face recognition that marks worker attendance automatically.",
      contribution: [
        "Face recognition module for automated attendance marking",
        "Google Cloud Storage for site images and documents",
        "Structured procurement workflows for material requests and purchases",
      ],
      stack: ["Laravel", "PHP", "MySQL", "Google Cloud Storage"],
      links: [] as Link[],
      visual: "site" as const,
    },
    {
      id: "agroculture",
      title: "Agroculture",
      context: "Farmer–buyer marketplace",
      problem: "Intermediaries sat between farmers and the people buying from them.",
      solution:
        "A real-time marketplace where farmers and buyers talk to each other directly, with secure authentication and product listings built for high-concurrency traffic.",
      contribution: ["Marketplace design", "Secure authentication", "Product listing modules"],
      stack: ["PHP", "MySQL", "JavaScript"],
      links: [] as Link[],
      visual: "direct" as const,
    },
    {
      id: "screen-monitor",
      title: "Employee Screen Monitoring",
      context: "Nelgates Technologies",
      problem: "HR had no reliable picture of idle time during the working day.",
      solution:
        "An app that flags screen-off time over 3 minutes, asks the employee for a reason, and gives HR idle-time and productivity reports.",
      contribution: ["Idle detection with a 3-minute threshold", "Reason prompt", "HR reporting"],
      stack: ["Python"],
      links: [] as Link[],
      visual: "timeline" as const,
    },
    {
      id: "sales-crm",
      title: "Sales CRM",
      context: "Nelgates Technologies",
      problem: "The business development team needed to follow leads from first contact to conversion.",
      solution: "A CRM that tracks lead conversions and every interaction with a prospect.",
      contribution: ["Lead conversion tracking", "Prospect interaction history"],
      stack: ["React", "Node.js"],
      links: [] as Link[],
      visual: "track" as const,
    },
  ],

  /** Outcomes exactly as stated on the resume. */
  outcomes: [
    { value: "40%", label: "faster page loads", detail: "Custom PHP and CSS on WordPress / Elementor sites", where: "Nelgates" },
    { value: "35%", label: "less manual entry", detail: "An HRMS designed to replace hand-typed records", where: "Nelgates" },
    { value: "30%", label: "faster task execution", detail: "Servo and Save-As functionality with leaner data storage", where: "Zentron Lab" },
    { value: "25%", label: "smoother operator workflow", detail: "Top-Light feature redesign for measurement machines", where: "Zentron Lab" },
    { value: "99.9%", label: "data accuracy", detail: "JSON conversion tools between automation modules and backends", where: "Zentron Labs" },
    { value: "15%", label: "fewer invoice errors", detail: "A billing system with automated payment notifications", where: "Nelgates" },
  ],

  /** The resume's skills, regrouped by where they sit in a system. */
  skills: [
    { group: "What people see", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Bootstrap", "Figma"] },
    { group: "What runs behind it", items: ["Node.js", "Python", "PHP", "Laravel", "Django", "Java", "JDBC", "REST APIs"] },
    { group: "Where data lives", items: ["SQL", "MySQL", "PostgreSQL", "Supabase"] },
    { group: "Where it ships", items: ["AWS", "Google Cloud Storage", "Hostinger", "Git", "GitHub", "SVN", "VS Code"] },
    { group: "Sites and stores", items: ["WordPress", "Elementor", "WooCommerce"] },
    { group: "On the machine floor", items: ["LabVIEW", "Python", "Servo and sensor integration"] },
  ],

  approach: [
    "Agile teams: sprint planning, code reviews and daily stand-ups.",
    "Close to the people using the software, from client meetings and requirement gathering to design handoffs.",
    "Documentation and test cases written alongside new modules, so the next person onboards faster.",
  ],
};

export type Site = typeof site;
export type Project = Site["projects"][number];
