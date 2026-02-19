#!/usr/bin/env node
/**
 * Quick Test - Direct AI Analysis Without Server
 * Tests the AI function directly from resumeAnalyzer.js using OpenRouter
 */

import { getAIPoweredSuggestions, analyzeResumeWithAI } from "./utils/resumeAnalyzer.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const sampleResume = `
JOHN DOE
john.doe@email.com | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 3+ years building scalable web applications.

TECHNICAL SKILLS
JavaScript, React, Node.js, MongoDB, PostgreSQL, Python, Docker, AWS, Git, REST API, GraphQL

PROFESSIONAL EXPERIENCE

Senior Developer | Tech Company | Jan 2023 - Present
- Developed React.js application improving user engagement by 40%
- Implemented microservices architecture using Node.js and Docker
- Led team of 5 developers on critical project delivery
- Optimized database queries reducing load time by 60%
- Managed deployment pipeline using AWS and CI/CD tools

Junior Developer | Startup Inc | Jun 2020 - Dec 2022
- Built REST APIs using Express.js and MongoDB
- Created responsive UI components with React
- Collaborated with cross-functional teams
- Resolved production bugs improving system stability by 35%

EDUCATION
Bachelor of Science in Computer Science
University Name, 2020
`;

async function testAI() {
  console.log("🧪 Testing AI Resume Analysis with OpenRouter\n");
  console.log("⚙️  Configuration:");
  console.log(`   API Key: ${process.env.OPENROUTER_API_KEY ? "✓ Set" : "✗ Not set"}`);
  console.log(`   API URL: ${process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1"}`);
  console.log(`   Model: ${process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo"}\n`);

  console.log("📄 Sample Resume (first 200 chars):");
  console.log(sampleResume.substring(0, 200) + "...\n");

  console.log("⏳ Calling OpenRouter AI (this may take 5-10 seconds)...\n");
  const startTime = Date.now();

  try {
    const analysis = await analyzeResumeWithAI(sampleResume);
    const duration = (Date.now() - startTime) / 1000;

    console.log(`✓ Response received in ${duration.toFixed(2)}s\n`);
    console.log("📊 Analysis Results:");
    console.log(JSON.stringify(analysis, null, 2));

    if (analysis.aiPowered) {
      console.log("\n✅ SUCCESS! AI Analysis is working!");
      console.log("🤖 AI-Powered Suggestions provided by OpenRouter API");
    } else {
      console.log("\n⚠️  Pattern-matching analysis only (AI not used/failed)");
      console.log("Check your OpenRouter API key and ensure it's valid");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAI();
