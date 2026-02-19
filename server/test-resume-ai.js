import https from "https";

// Sample resume text for testing
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
- Trained 3 new team members

EDUCATION
Bachelor of Science in Computer Science
University Name, 2020

PROJECTS
E-commerce Platform - Built full-stack application handling 100k+ daily users
Task Management Tool - Led development achieving 98% uptime
Open Source Contributions - Active contributor to React ecosystem projects
`;

async function testResumeAnalysis() {
  console.log("🧪 Testing Resume AI Analysis\n");
  console.log("📄 Sample Resume:\n", sampleResume.substring(0, 200), "...\n");

  const apiUrl = "http://localhost:8000/api/v1/resume/analyze-text";
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({ resumeText: sampleResume });

    const options = {
      hostname: "localhost",
      port: 8000,
      path: "/api/v1/resume/analyze-text",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    console.log("📡 Sending request to:", `http://${options.hostname}:${options.port}${options.path}`);
    console.log("⏳ Waiting for AI analysis (this may take 5-10 seconds)...\n");

const startTime = Date.now();

    const req = require("http").request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const duration = (Date.now() - startTime) / 1000;
        console.log(`✓ Response received in ${duration.toFixed(2)}s\n`);
        console.log("Status Code:", res.statusCode);
        console.log("\n📊 Response:\n");
        
        try {
          const jsonData = JSON.parse(data);
          console.log(JSON.stringify(jsonData, null, 2));
          
          // Check if AI was used
          if (jsonData.analysis && jsonData.analysis.aiPowered) {
            console.log("\n✅ AI ANALYSIS SUCCESSFUL!");
            console.log("🤖 AI-Powered Suggestions:");
            jsonData.analysis.suggestions.forEach((sug, idx) => {
              console.log(`\n  ${idx + 1}. [${sug.priority.toUpperCase()}] ${sug.title}`);
              console.log(`     Category: ${sug.category}`);
              console.log(`     ${sug.description}`);
            });
          } else if (jsonData.analysis) {
            console.log("\n⚠️ FALLBACK ANALYSIS (Pattern Matching Only)");
            console.log("AI was not used, but pattern-matching suggestions were provided.");
          }
        } catch (e) {
          console.log("Raw Response:", data);
        }
        
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error("❌ Error:", error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testResumeAnalysis().catch(console.error);
