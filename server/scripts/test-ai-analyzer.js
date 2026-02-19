/**
 * Test Script for AI Resume Analyzer
 * Run: node scripts/test-ai-analyzer.js
 * 
 * This script tests the AI resume analyzer integration without running the full server
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResumeWithAI } from "../utils/resumeAnalyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Sample resume for testing
const sampleResume = `
JOHN DOE
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 3+ years of expertise in React, Node.js, and MongoDB. 
Passionate about building scalable web applications and mentoring junior developers.

EXPERIENCE

Senior Frontend Developer | TechCorp Inc. | Jan 2022 - Present
- Developed React-based dashboard processing 1M+ daily users, increasing performance by 40%
- Led team of 4 junior developers in building 5 major features
- Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes
- Improved code quality with unit tests achieving 85% coverage

Junior Developer | StartupXYZ | Jun 2020 - Dec 2021
- Created REST APIs using Node.js and Express handling 500K+ requests daily
- Built responsive UI components with React and Tailwind CSS
- Collaborated with 3-member team to deliver projects on schedule

EDUCATION
Bachelor of Science in Computer Science | University of Tech | May 2020
Relevant Coursework: Data Structures, Web Development, Database Design

TECHNICAL SKILLS
Languages: JavaScript, Python, SQL, HTML, CSS
Frontend: React, Vue.js, Tailwind CSS, Material-UI
Backend: Node.js, Express, Django, Flask
Databases: MongoDB, PostgreSQL, Firebase
DevOps & Tools: Docker, AWS, Git, Jira, Jenkins
Other: REST APIs, GraphQL, Agile, Problem Solving

PROJECTS

Portfolio Website | Personal Project | 2023
- Designed and launched full-stack portfolio using Next.js and MongoDB
- Achieved 95+ Lighthouse score for performance and accessibility
- Deployed on Vercel with automated CI/CD

Task Management App | GitHub | 2022
- Built collaborative task manager with real-time updates using WebSockets
- 500+ active users, 4.8/5 rating on app store
- 89% test coverage with Jest and React Testing Library

CERTIFICATIONS
- AWS Certified Cloud Practitioner (2023)
- Google Cloud Associate Cloud Engineer (2022)
`;

async function testAIAnalyzer() {
  console.log("🤖 Testing AI Resume Analyzer Integration\n");
  console.log("=".repeat(60));

  // Check environment
  const apiKey = process.env.APIFREELLM_API_KEY;
  const apiUrl = process.env.APIFREELLM_API_URL;
  const enableAI = process.env.ENABLE_AI_RESUME_ANALYSIS;

  console.log("\n📋 Configuration:");
  console.log(`  API Key Set: ${apiKey ? "✅ Yes" : "❌ No"}`);
  console.log(`  API URL: ${apiUrl || "https://api.freellm.com/v1"}`);
  console.log(`  AI Analysis Enabled: ${enableAI !== "false" ? "✅ Yes" : "❌ No"}`);

  if (!apiKey && process.env.ENABLE_AI_RESUME_ANALYSIS !== "false") {
    console.log("\n⚠️  WARNING: APIFREELLM_API_KEY not set in .env");
    console.log("   Pattern-matching analysis will be used as fallback.");
  }

  console.log("\n📄 Running Analysis...\n");

  try {
    const startTime = Date.now();
    const analysis = await analyzeResumeWithAI(sampleResume);
    const elapsed = Date.now() - startTime;

    console.log(`✅ Analysis Complete (${elapsed}ms)\n`);

    console.log("📊 Results:");
    console.log(`  Score: ${analysis.score}/100`);
    console.log(`  AI-Powered: ${analysis.aiPowered ? "✅ Yes" : "❌ Pattern-Matching Only"}`);
    console.log(`  Total Suggestions: ${analysis.suggestions.length}`);
    console.log(`  Word Count: ${analysis.wordCount}`);
    console.log(`  Skills Found: ${analysis.skillsFound}`);
    console.log(`  Metrics Found: ${analysis.metricsFound}`);
    console.log(`  Sections Found: ${analysis.sectionCount}\n`);

    console.log("💡 Suggestions:\n");
    analysis.suggestions.forEach((suggestion, index) => {
      const source = suggestion.source === "ai" ? "🤖 AI" : "📋 Pattern";
      const priority = {
        high: "🔴 HIGH",
        medium: "🟡 MEDIUM",
        low: "🟢 LOW",
      }[suggestion.priority];

      console.log(`${index + 1}. ${priority} - ${suggestion.title} [${source}]`);
      console.log(`   Category: ${suggestion.category}`);
      console.log(`   ${suggestion.description}\n`);
    });

    console.log("=".repeat(60));
    console.log("✅ Test Complete - AI Resume Analyzer is working!\n");

    if (!analysis.aiPowered) {
      console.log("ℹ️  Note: AI analysis is running in fallback mode.");
      console.log("   Ensure APIFREELLM_API_KEY is set in .env for full AI features.\n");
    }

    return true;
  } catch (error) {
    console.error("❌ Error during analysis:\n", error.message);
    console.log("\n" + "=".repeat(60));
    console.log("Troubleshooting tips:");
    console.log("  1. Check .env file exists with APIFREELLM_API_KEY");
    console.log("  2. Verify API key is valid at https://apifreellm.com/");
    console.log("  3. Check internet connection");
    console.log("  4. Set ENABLE_AI_RESUME_ANALYSIS=false to test fallback mode\n");
    return false;
  }
}

// Run the test
testAIAnalyzer().catch(console.error);
