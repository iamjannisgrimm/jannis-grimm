import aviatarImage from "../assets/aviatar.jpeg";
import asuImage from "../assets/asu.jpg";
import lufthansaImage from "../assets/lufthansa.jpeg";
import seeme2026Background from "../assets/seeme-2026-background.PNG";
import seeme2026AppStoreBadge from "../assets/seeme-2026-appstorebadge.png";
import seeme2026ProductMobile from "../assets/seeme-2026-product-mobile.png";
import seeme2026Product from "../assets/seeme-2026-product.png";
import synechronImage from "../assets/synechron.jpg";
import tarsOpenClawSystem from "../assets/tars-openclaw-system.svg";

const timelineData = [
  {
    date: "2026",
    title: "SeeMe",
    subtitle: "Hero",
    description: "A private, personal AI coaching network — your Mentor, life coach, career coach, and more, all in one place that truly knows you.",
    secondDescription: "iOS live on the App Store. Raising $500K at a $5M cap to open the platform to 232,000+ professional coaches.",
    background: "#111111",
    backgroundImage: seeme2026Background,
    productImage: seeme2026Product,
    productImageMobile: seeme2026ProductMobile,
    appStoreBadge: seeme2026AppStoreBadge,
    appStoreUrl: "https://apps.apple.com/us/app/seeme-personal-growth/id6739706517",
    website: "https://seemeai.app",
    techStack: [],
    link: "",
    linkColor: "#FFFFFF",
    isHero: true,
    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 0,
  },
  {
    date: "2026",
    title: "TARS / OpenClaw",
    subtitle: "Personal AI Operating System",
    description: "Built a local-first AI control plane that turns everyday messages into routed, tool-using, verified work across code, research, memory, dashboards, and automations.",
    descriptionBlocks: [
      {
        body: "Built a **local-first AI control plane** that turns everyday messages into routed, tool-using, verified work across code, research, memory, dashboards, and automations.",
        style: "default",
      },
      {
        body: "Designed canonical agents — **TARS, Claw, Developer, Marketer, Research, and News Retriever** — with clear ownership, safe delegation, and persistent memory.",
        style: "default",
      },
      {
        body: "Runs from iMessage on my Mac, reads live Kanban state, executes approved cards, monitors AI/news signals, and closes the loop with tests, commits, and audit trails.",
        style: "light",
      },
    ],
    image: tarsOpenClawSystem,
    background: "#080A10",
    techStack: [],
    link: "https://github.com/openclaw/openclaw",
    linkColor: "#7DD3FC",
    topSpacing: 0,
    bottomSpacing: 0,
  },
  {
    date: "2025",
    title: "SeeMe",
    subtitle: "Founder & Lead Engineer",
    description: "Designed and shipped the full iOS product solo — multi-coach AI architecture, on-device privacy system, and a B2B platform strategy built from the ground up.",
    secondDescription: "Raised the venture to a $5M valuation cap. Actively fundraising a $500K seed round.",
    icon: "seeme25/Icon.png",
    image: "seeme25/seemelineup.png",
    background: "#2A2A2A",
    techStack: [
      "techstack/swiftui.png",
      "techstack/swiftdata.png",
      "techstack/ollama.png",
      "techstack/mistral.png"
    ],
    link: "https://seemeapp.ai",
    linkColor: "#19CCFF",
    //-------------------------------------------
    topSpacing: 20,
    bottomSpacing: 0,
  },
  {
    date: "2024 - Present",
    title: "Synechron Inc",
    subtitle: "Software Engineer",
    description: "Production AI engineering at enterprise scale — delivering LLM systems, AI-first product features, and intelligent automation for major financial and tech clients.",
    icon: "synechron/synechron.png",
    image: synechronImage,
    background: "#2A2A2A",
    techStack: [
      "techstack/swiftui.png",
      "techstack/react.png",
      "techstack/openai.png",
      "techstack/jira.png",

    ],
    link: "https://www.synechron.com",
    linkColor: "#F6E228",

    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 0,
  },
  {
    date: "2024",
    title: "AI Cover Letter Generator",
    subtitle: "Side Project",
    icon: "coverletter/terminal.png",
    description: "Built an AI tool that generates tailored cover letters in under 10 seconds — a real problem, solved in a weekend, and shipped to GitHub.",
    secondDescription: "10 seconds vs. 10 minutes manually — proof that the right AI application just makes a problem disappear.",
    image: "coverletter/coverlettergen.png",
    background: "#2A2A2A",
    techStack: [
      "techstack/python.png",
      "techstack/openai.png",

    ],
    link: "https://github.com/iamjannisgrimm/CoverLetter",
    linkColor: "#465EC3",
    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 40,
  },
  {
    date: "2023",
    title: "Lufthansa",
    subtitle: "Software Engineer Intern",
    icon: "lufthansa/lhicon.png",
    description: "Designed and shipped a GoLang and Angular microservice with Docker and Kubernetes — production-grade infrastructure managing critical database workflows for aviation operations.",
    secondDescription: "Attracted two new clients, boosting revenue and market competitiveness.",
    image: lufthansaImage,
    background: "#FFFFFF",
    techStack: [
      "techstack/angular.png",
      "techstack/go.png",
      "techstack/kubernetes.png",
      "techstack/springboot.png",
      "techstack/docker.png",

    ],
    link: "https://www.lufthansa-industry-solutions.com/de-en/",
    linkColor: "#000000",

    //-------------------------------------------
    topSpacing: 120,
    bottomSpacing: 0,
  },
  {
    date: "2023",
    title: "SeeMe LLC",
    subtitle: "Founder & CEO",
    icon: "seeme2023/seemeoldicon.png",
    description: "Founded SeeMe and led a team building an AI life coach on OpenAI — first version of the product. Managed architecture, hiring, product, and testing simultaneously.",
    secondDescription: "Ran 50+ user sessions, validated the core coaching hypothesis, and laid the architecture for what became the 2026 platform.",
    image: "seeme2023/seeme2023lineup.png",
    background: "#FFFFFF",
    techStack: [
      "techstack/swiftui.png",
      "techstack/firebase.png",
      "techstack/nodejs.png",
      "techstack/openai.png",

    ],
    link: "https://seemeapp.ai",
    linkColor: "#03CDA2",

    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 0,
  },
  {
    date: "2022",
    title: "Lufthansa",
    subtitle: "Software Engineer Intern",
    icon: "lufthansa/lhicon.png",
    description: "Redesigned the UX for a digital flight logbook used daily by pilots and maintenance crews across Lufthansa's fleet.",
    secondDescription: "Reduced maintenance-related calls by 40% and increased user satisfaction by 25%.",
    image: aviatarImage,
    background: "#FFFFFF",
    techStack: [
      "techstack/angular.png",
      "techstack/materialui.png",
      "techstack/jira.png",
    ],
    link: "https://www.aviatar.com/en/technical-logbook",
    linkColor: "#000000",
    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 40,
  },
  {
    date: "2022",
    title: "SeeMe",
    subtitle: "Passion Project",
    icon: "seeme2022/seeme22icon.png",
    image: "seeme2022/seeme22lineup.png",
    description: "Started SeeMe as a personal journaling app — the first version of what became an AI coaching platform. Built for myself before I knew others would want it.",
    background: "#2A2A2A",
    techStack: [
      "techstack/swiftui.png",
      "techstack/coredata.png",
    ],
    link: "https://seemeapp.ai",
    linkColor: "#1AD866",
    //-------------------------------------------
    topSpacing: 120,
    bottomSpacing: 0,
  },
  {
    date: "2020 - 2021",
    title: "Introhm",
    subtitle: "Lead iOS Engineer",
    icon: "introhm/introhmicon.png",
    image: "introhm/introhmlineup.png",
    description: "Led iOS development for a fitness analytics platform — integrating ML motion models and real-time sensor data to give athletes and coaches actual performance intelligence.",
    background: "#2A2A2A",
    techStack: [
      "techstack/swiftui.png",
      "techstack/firebase.png",
      "techstack/coredata.png",
      "techstack/xsens.png",

    ],
    link: "https://www.thirdanalytics.com/introhm",
    linkColor: "#EE4831",

    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 0,
  },
  {
    date: "2020 - 2023",
    title: "Arizona State University",
    subtitle: "B.S. Computer Science",
    icon: "asu/asuiconrm.png",
    image: asuImage,
    description: "B.S. Computer Science at ASU — #1 university in innovation. Built systems thinking, product design, and engineering fundamentals across four years of hands-on work.",
    background: "#2A2A2A",
    techStack: [
    ],
    link: "https://www.asu.edu",
    linkColor: "#901340",
    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 40,
  },
  {
    date: "2018",
    title: "MyLife",
    subtitle: "iOS Passion Project",
    icon: "mylife/mylifeicon.png",
    image: "mylife/mylifelineup.png",
    description: "Shipped 'My Life at a Glance' — a milestone and life tracker. First proof that building something with genuine emotional value creates real user love.",
    secondDescription: "10,000+ downloads and a 4.8+ rating, driven purely by word of mouth.",
    background: "#FFFFFF",
    techStack: [
      "techstack/swiftui.png",
      "techstack/coredata.png",
      "techstack/cloudkit.png",
    ],
    link: "",
    //-------------------------------------------
    topSpacing: 120,
    bottomSpacing: 0,
  },
  {
    date: "2017",
    title: "Flight LogBook",
    subtitle: "iOS Passion Project",
    icon: "flightlogbook/flightlogbookicon.png",
    image: "flightlogbook/flightlogbooklineup.png",
    description: "First app — a flight log for aviation enthusiasts, built at 16 to solve something I actually needed. The start of a habit: ship what you'd use yourself.",
    background: "#FFFFFF",
    techStack: [
      "techstack/swiftui.png",
      "techstack/coredata.png",

    ],
    link: "",
    //-------------------------------------------
    topSpacing: 0,
    bottomSpacing: 40,
  }
];

export default timelineData;
