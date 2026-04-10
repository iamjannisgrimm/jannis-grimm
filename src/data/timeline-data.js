import aviatarImage from "../assets/aviatar.jpeg";
import asuImage from "../assets/asu.jpg";
import lufthansaImage from "../assets/lufthansa.jpeg";
import seeme2026Background from "../assets/seeme-2026-background.PNG";
import seeme2026AppStoreBadge from "../assets/seeme-2026-appstorebadge.png";
import seeme2026ProductMobile from "../assets/seeme-2026-product-mobile.png";
import seeme2026Product from "../assets/seeme-2026-product.png";
import synechronImage from "../assets/synechron.jpg";

const timelineData = [
  {
    date: "2026",
    title: "SeeMe",
    subtitle: "Hero",
    description: "A private, personal AI built around how you think, reflect, and grow - with expert coaches in your corner.",
    secondDescription: "Background image and product visual will be added next.",
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
    date: "2025",
    title: "SeeMe",
    subtitle: "Lead Engineer",
    location: "Tech Company Inc., San Francisco",
    description: "Your digital, fully-private life coach who truly understands you.",
    secondDescription: "Scaled venture to $2.5M valuation, attracting interest from Silicon Valley investors.",
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
    description: "Hands-on AI Engineering consultant building intelligent systems that drive real-world impact.",
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
    description: "Ability to generate cover letters in seconds, maximizing application efficiency.",
    secondDescription: "10 seconds vs. 10 minutes manually—saving hours per job search.",
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
    description: "Built a GoLang and Angular based microservice with Docker/Kubernetes for efficient database management.",
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
    description: "Led a team to build digital life coach with OpenAI API for AI-driven feedback and tracking.",
    secondDescription: "Monitored 50+ test users closely, driving iterative improvements for next development phase.",
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
    description: "Enhanced UI/UX for a digital flight logbook used by pilots and maintenance crews.",
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
    description: "Developed the first iteration of a journaling app, reinventing personal reflection with a product I wanted for myself.",
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
    description: "Led development of a fitness app using Swift and Objective-C, integrating ML models for deep athlete performance analytics.",
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
    description: "Focused on Software Engineering, Design, and Innovation at ASU, consistently ranked #1 university in innovation.",
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
    description: "Built 'My Life at a Glance' to help users track milestones and achievements.",
    secondDescription: "10,000+ downloads and a 4.8+ rating, driving user satisfaction and engagement.",
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
    description: "Built 'Flight Log Book' for aviation enthusiasts to document flight experiences.",
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
