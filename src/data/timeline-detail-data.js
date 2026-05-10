export const timelineDetailData = [
    {
      title: "Introduction",
      body: "SeeMe is a personal AI coaching network — a Mentor who guides your overall journey, plus specialized coaches for career, life, health, and wellbeing. They share context, hand off intelligently, and deliver structured sessions, not open-ended chat. Built on real coaching frameworks with a privacy-first architecture: all personal data lives on-device by default.",
      image: "seeme-detail/introduction.png",
    },
    {
      title: "Technology",
      subtitle: "System Architecture",
      body: "Privacy-first by architecture, not just policy. All personal data lives in SwiftData on-device. Cloud-enhanced mode routes only encrypted prompt context through OpenAI or Anthropic APIs — never stored, never trained on. Users can switch between on-device models and cloud providers without losing continuity. The AI abstraction layer is fully decoupled from the storage layer by design.",
      image: "seeme-detail/architecture.png",
    },
    {
      subtitle: "Data Model",
      body: "Every user builds a private intelligence layer: journal entries, session summaries, Wheel of Life scores, focus areas, habit logs, and optional integrations with HealthKit, Calendar, and Screen Time. Session summaries feed back into a living user context that personalizes every subsequent conversation. The system compounds in value over time without ever exfiltrating data.",
      image: "seeme-detail/datamodel.png",
    },
    {
      subtitle: "AI Engineering",
      body: "The multi-coach architecture gives each coach a distinct persona, framework, and communication style — while all read from the same shared user context. The Mentor orchestrates handoffs based on conversation signals, directing users to the right coach at the right moment. Custom prompt engineering enforces structured sessions and real professional coaching frameworks rather than open-ended LLM affirmation.",
      image: "seeme-detail/ai-engineering.png",
    },
    {
      title: "Skills Applied",
      body: "Shipped a production iOS app as sole engineer: full-stack SwiftUI, SwiftData persistence, multi-provider AI integration (OpenAI, Anthropic, on-device models), vision board image generation, and custom prompt engineering systems. Also owns the B2B web landing page, an internal analytics dashboard (Next.js + Supabase), contractor agreements (SAFEs + NDAs), and a $500K seed fundraise.",
    },
    {
      title: "Challenges & Lessons",
      body: "The hardest problem wasn't technical — it was product. An AI that guides rather than affirms requires precise prompt architecture and real coaching frameworks, not just a personality wrapper. User sessions revealed people needed structure and scheduled check-ins more than open-ended chat. Privacy-first architecture added significant engineering constraints but became the core differentiator that justifies every tradeoff.",
    },
    {
      body: "Building as a solo founder forced extreme prioritization. Every feature decision was also a fundraising decision — the B2B coach platform emerged from asking what makes the business defensible, not just what users want in the moment. The biggest lesson: the product you ship and the product you pitch are the same thing. Ship it. Then tell the story.",
    }
  ];
