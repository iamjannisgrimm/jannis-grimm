// /src/data/prompts.js
const conversationPrompts = [
    "What’s a project you’re proud of that most people wouldn’t notice at first glance?",
    "How do you approach balancing creativity with practicality in your work?",
    "When learning something new, what’s your process for moving from curiosity to mastery?",
    "What do you enjoy doing in your free time?",
    "What's your favorite project?"
  ];

  // Add your user context here (update the string with your info)
  const userContext = `
  I am Jannis Grimm is a German software engineer, entrepreneur, and builder with a passion for developing innovative applications that solve real-world problems. Originally from Germany, he attended high school in Greece before moving to the United States to pursue a Bachelor’s degree in Computer Science at Arizona State University. With a strong focus on software engineering, innovation, and design, he has cultivated expertise in mobile development, AI, backend systems, and business strategy.
  
  His journey began at the age of 14-15 when he started coding after Swift was announced at WWDC 2014. Hooked from the start, he built his first applications over the next few years and released his first app in 2017— a passion project digitalizing his childhood paper logbook. This app featured sorting, querying, filtering, and tagging images of trips and was built using UIKit and Core Data. In 2018, he launched his next app, “My Life,” a personal milestone tracker that logged achievements, trips, and events, built with similar architecture but incorporating SwiftUI and CloudKit for the first time.
  
  Eager to advance his knowledge, Jannis moved to the U.S. for university, attending Arizona State University, where he focused on software engineering, innovation, and technical entrepreneurship. Early on, he won a hackathon at ASU, which led to his first startup experience at Intom, a company developing fitness tracking solutions using hardware sensors and machine learning. Initially hired as an iOS developer, he quickly progressed to lead engineer, designing the application architecture and managing a team. The app integrated SwiftUI, Firebase, Core Data, and external APIs to process sensor data, enabling advanced workout analysis, including rep counting and movement insights.
  
  Jannis continued pursuing passion projects, launching “Simi” in 2020 as a data-driven journaling app providing correlations between personal habits, mood, and fitness. In 2022, he secured his first software engineering internship at Lufthansa, working on the Digital Flight Logbook Team to streamline pilot paperwork and improve communication with maintenance teams. His role focused on UI development, using Angular and Git. In 2023, he returned to Lufthansa for another internship, this time building a data visualization microservice that helped secure two new clients. This project involved Angular, Docker, Kubernetes, and Spring Boot for backend development.
  
  In 2023, Jannis officially founded “Simi” as a startup, pivoting it into a life coaching application that integrated AI for personalized insights, goal tracking, and coaching. This iteration featured a fully functional backend built with Firebase and Node.js and leveraged the OpenAI API for AI-driven interactions. In 2024, while searching for job opportunities post-graduation, he built an AI Cover Letter Generator, an application that generated tailored cover letters in seconds by analyzing job descriptions. Built with Python and OpenAI’s API, it saved users significant time in job applications.
  
  He later joined Syncron as a Junior Developer, where he worked on iOS development for a major banking application (Synchrony) and expanded his skills in AI engineering, project management, business analysis, and React. Meanwhile, he continued iterating on “Simi”, leading to its most significant evolution in 2025— a fully private, AI-powered life coach. This latest version is designed to run entirely on-device, removing backend dependencies and ensuring full data privacy. It features a local AI model (Mistral 7B), a redesigned architecture, and an intuitive, high-performance UI.
  
  Jannis thrives at the intersection of engineering, business, and innovation. He embraces a builder and doer mindset, always learning and applying new technologies while iterating on his ideas to bring real-world value. His vision for the future is to continue playing a hybrid role in startups, combining software engineering, product management, and business development. He is passionate about solving problems, driving innovation, and delivering high-impact solutions—whether in personal projects, startup ventures, or industry roles.
  `;
  
  
export { conversationPrompts, userContext };
  export default conversationPrompts;