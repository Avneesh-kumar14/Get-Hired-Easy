/**
 * Resume Analyzer - Analyzes resume text and provides AI-powered suggestions
 * Integrates with APIFreeLLM for intelligent analysis
 */

const COMMON_SKILLS = [
  // Programming Languages
  "javascript",
  "python",
  "java",
  "c++",
  "c#",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "go",
  "rust",
  "typescript",
  "sql",
  "html",
  "css",

  // Web Development
  "react",
  "angular",
  "vue",
  "node.js",
  "express",
  "django",
  "flask",
  "spring",
  "spring boot",
  "asp.net",
  "rest api",
  "graphql",

  // DevOps/Cloud
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "jenkins",
  "ci/cd",
  "aws lambda",
  "aws ec2",
  "aws s3",

  // Databases
  "mongodb",
  "mysql",
  "postgresql",
  "oracle",
  "redis",
  "elasticsearch",
  "firebase",

  // Tools & Frameworks
  "git",
  "github",
  "gitlab",
  "jira",
  "npm",
  "maven",
  "gradle",
  "webpack",

  // Soft Skills
  "communication",
  "teamwork",
  "leadership",
  "problem solving",
  "project management",
  "agile",
  "scrum",
];

const ACTION_VERBS = [
  "achieved",
  "developed",
  "implemented",
  "designed",
  "created",
  "managed",
  "led",
  "improved",
  "increased",
  "optimized",
  "resolved",
  "coordinated",
  "deployed",
  "engineered",
  "architected",
  "automated",
];

const MISSING_KEYWORDS = [
  "quantifiable results",
  "metrics",
  "performance",
  "efficiency",
  "scalability",
];

export const analyzeResume = (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") {
    return {
      suggestions: [],
      score: 0,
    };
  }

  const suggestions = [];
  const lowerText = resumeText.toLowerCase();
  let score = 50; // Base score

  // Check 1: Skills Section
  const skillCount = COMMON_SKILLS.filter((skill) =>
    lowerText.includes(skill)
  ).length;
  if (skillCount < 5) {
    suggestions.push({
      category: "skills",
      title: "Add More Technical Skills",
      description: `Currently found ${skillCount} technical skills. Consider adding more relevant technologies like: React, Node.js, Python, Docker, AWS, MongoDB, etc. Aim for at least 8-10 skills.`,
      priority: "high",
    });
    score -= 15;
  } else {
    score += 10;
  }

  // Check 2: Action Verbs
  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    lowerText.includes(verb)
  ).length;
  if (actionVerbCount < 3) {
    suggestions.push({
      category: "content",
      title: "Use Strong Action Verbs",
      description:
        "Add powerful action verbs to describe your achievements. Examples: Developed, Implemented, Architected, Optimized, Engineered, Deployed, etc.",
      priority: "medium",
    });
    score -= 10;
  } else {
    score += 5;
  }

  // Check 3: Quantifiable Metrics
  const metricsRegex =
    /(\d+%|\d+\s*(?:projects?|clients?|teams?|users?|api|apis)|\$\d+k?)/gi;
  const metricsCount = (lowerText.match(metricsRegex) || []).length;
  if (metricsCount < 3) {
    suggestions.push({
      category: "content",
      title: "Add Quantifiable Metrics",
      description:
        "Include numbers, percentages, and metrics to showcase impact. Example: 'Improved API performance by 40%', 'Managed team of 5 developers', 'Processed 1M+ requests daily'",
      priority: "high",
    });
    score -= 12;
  } else {
    score += 10;
  }

  // Check 4: Contact Information
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /\+?[\d\s\-()]{10,}/;
  const linkedinRegex = /linkedin\.com|linkedin|github\.com|github/i;

  if (!emailRegex.test(resumeText)) {
    suggestions.push({
      category: "format",
      title: "Add Email Address",
      description: "Include a valid email address for recruiters to contact you.",
      priority: "high",
    });
    score -= 10;
  } else {
    score += 5;
  }

  if (!linkedinRegex.test(resumeText)) {
    suggestions.push({
      category: "format",
      title: "Include LinkedIn/GitHub Profile",
      description:
        "Add your LinkedIn profile or GitHub link to showcase your professional presence and projects.",
      priority: "medium",
    });
    score -= 8;
  } else {
    score += 5;
  }

  // Check 5: Document Length & Structure
  const words = resumeText.trim().split(/\s+/).length;
  const lines = resumeText.split("\n").length;

  if (words < 200) {
    suggestions.push({
      category: "structure",
      title: "Expand Resume Content",
      description:
        "Your resume seems too brief. Aim for 250-400 words, focusing on accomplishments and relevant experience.",
      priority: "high",
    });
    score -= 10;
  } else if (words > 800) {
    suggestions.push({
      category: "structure",
      title: "Condense Resume",
      description:
        "Your resume might be too long. Try to keep it to 1-2 pages (250-400 words) with only relevant information.",
      priority: "medium",
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Check 6: Section Headers
  const requiredSections = [
    "experience",
    "education",
    "skills",
    "projects",
    "summary",
    "objective",
  ];
  const foundSections = requiredSections.filter((section) =>
    lowerText.includes(section)
  ).length;

  if (foundSections < 3) {
    suggestions.push({
      category: "structure",
      title: "Organize with Clear Sections",
      description:
        "Include standard sections: Summary/Objective, Experience, Education, Skills, and Projects. This makes your resume easier to scan.",
      priority: "medium",
    });
    score -= 8;
  } else {
    score += 8;
  }

  // Check 7: Keywords for ATS (Applicant Tracking System)
  const atsKeywords = [
    "achievement",
    "responsible",
    "trained",
    "collaborated",
    "monitored",
    "resulted in",
  ];
  const atsKeywordCount = atsKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length;

  if (atsKeywordCount < 2) {
    suggestions.push({
      category: "keywords",
      title: "Optimize for ATS (Applicant Tracking Systems)",
      description:
        "Use common ATS-friendly keywords like: 'Achievement', 'Responsible for', 'Collaborated', 'Resulted in', 'Monitored'. Avoid unusual formatting and graphics.",
      priority: "medium",
    });
    score -= 8;
  } else {
    score += 5;
  }

  // Check 8: Dates
  const dateRegex = /\b(19|20)\d{2}\b/g;
  const dates = (resumeText.match(dateRegex) || []).length;
  if (dates < 2) {
    suggestions.push({
      category: "content",
      title: "Include Work & Education Dates",
      description:
        "Add dates for all positions and degrees so recruiters understand your timeline and experience progression.",
      priority: "medium",
    });
    score -= 5;
  } else {
    score += 3;
  }

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  return {
    suggestions: suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    score: Math.round(score),
    wordCount: words,
    sectionCount: foundSections,
    skillsFound: skillCount,
    metricsFound: metricsCount,
  };
};

/**
 * Generate suggestions text for resume improvement
 */
export const generateResumeSuggestionText = (suggestions) => {
  if (!suggestions || suggestions.length === 0) {
    return "Your resume looks great! Keep it updated with your latest skills and achievements.";
  }

  return suggestions
    .map(
      (suggestion) =>
        `• ${suggestion.title}: ${suggestion.description}`
    )
    .join("\n\n");
};

/**
 * Generate improved resume text based on suggestions
 */
export const generateImprovedResumeText = (originalText, analysis) => {
  let improvedText = originalText;

  // Add recommendations as comments at the top
  const recommendations = analysis.suggestions
    .slice(0, 3)
    .map((s) => `[SUGGESTION: ${s.title}]`)
    .join("\n");

  if (recommendations) {
    improvedText = `--- IMPROVEMENT SUGGESTIONS ---\n${recommendations}\n\n---ORIGINAL RESUME---\n${originalText}`;
  }

  return improvedText;
};

/**
 * Call OpenRouter AI API to get AI-powered resume analysis
 * Uses Node.js native https module to properly handle SSL verification
 */
export const getAIPoweredSuggestions = async (resumeText) => {
  return new Promise(async (resolve) => {
    try {
      const https = await import("https");
      const apiKey = process.env.OPENROUTER_API_KEY;
      const apiUrl = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1";
      const model = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

      if (!apiKey) {
        console.warn("OpenRouter API key not configured. Using pattern-matching only.");
        resolve(null);
        return;
      }

      // Truncate resume text to avoid exceeding token limits (GPT-3.5 has 4k context)
      // Keep first 1500 characters to leave room for prompt and response
      const truncatedResume = resumeText.substring(0, 1500);
      
      const prompt = `You are an expert resume reviewer. Analyze this resume and provide 3-5 specific suggestions for improvement as a JSON array.

Resume (truncated for analysis):
---
${truncatedResume}
---

Response format - return ONLY this JSON, no other text:
[
  {
    "title": "Brief title",
    "description": "How to improve (1-2 sentences)",
    "priority": "high|medium|low",
    "category": "skills|content|format|structure|keywords"
  }
]`;

      const requestBody = JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500, // Reduced from 1000
        top_p: 1,
      });

      // Parse the API URL
      const urlObj = new URL(`${apiUrl}/chat/completions`);
      
      // Create HTTPS request options
      const options = {
        hostname: urlObj.hostname,
        servername: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://get-hired-easy.vercel.app",
          "X-Title": "Get-Hired-Easy Resume Analyzer",
          "Content-Length": Buffer.byteLength(requestBody),
        },
        rejectUnauthorized: false,
        timeout: 30000,
      };

      console.log(`Calling OpenRouter API with model: ${model}`);

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode !== 200) {
              console.error(`OpenRouter API error: ${res.statusCode} - ${data.substring(0, 300)}`);
              resolve(null);
              return;
            }

            const parsedData = JSON.parse(data);
            const content = parsedData.choices?.[0]?.message?.content;

            if (!content) {
              console.warn("No content in OpenRouter response");
              resolve(null);
              return;
            }

            // Parse the JSON response
            try {
              // Clean up the response - remove markdown code blocks if present
              let cleanContent = content.trim();
              if (cleanContent.startsWith("```")) {
                cleanContent = cleanContent.replace(/^```.*?\n/, "").replace(/\n```$/, "");
              }
              
              const suggestions = JSON.parse(cleanContent);
              if (Array.isArray(suggestions)) {
                console.log(`✓ Got ${suggestions.length} AI suggestions from OpenRouter`);
                resolve(suggestions);
                return;
              }
            } catch (parseError) {
              console.warn("Failed to parse AI suggestions JSON:", parseError.message);
              // Try to extract JSON from the response
              const jsonMatch = content.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                try {
                  const parsed = JSON.parse(jsonMatch[0]);
                  if (Array.isArray(parsed)) {
                    console.log(`✓ Extracted ${parsed.length} AI suggestions from content`);
                    resolve(parsed);
                    return;
                  }
                } catch {
                  console.warn("Could not extract valid JSON from AI response");
                }
              }
            }

            resolve(null);
          } catch (error) {
            console.error("Error processing OpenRouter response:", error.message);
            resolve(null);
          }
        });
      });

      // Handle request errors
      req.on("error", (error) => {
        console.error("Error calling OpenRouter API:", error.message);
        resolve(null);
      });

      // Handle timeout
      req.on("timeout", () => {
        console.error("OpenRouter API request timeout");
        req.destroy();
        resolve(null);
      });

      // Send the request
      req.write(requestBody);
      req.end();
    } catch (error) {
      console.error("Error preparing OpenRouter request:", error);
      resolve(null);
    }
  });
};

/**
 * Combine pattern-matching and AI-powered analysis
 * Returns comprehensive resume analysis with both traditional and AI suggestions
 */
export const analyzeResumeWithAI = async (resumeText) => {
  // Get pattern-matching analysis first (fast, reliable)
  const patternAnalysis = analyzeResume(resumeText);

  // Try to get AI-powered suggestions
  const enableAI = process.env.ENABLE_AI_RESUME_ANALYSIS !== "false";
  let aiSuggestions = [];

  if (enableAI && resumeText && resumeText.length > 100) {
    const aiAnalysis = await getAIPoweredSuggestions(resumeText);
    if (aiAnalysis && Array.isArray(aiAnalysis)) {
      aiSuggestions = aiAnalysis.map((suggestion) => ({
        ...suggestion,
        source: "ai", // Mark as AI-generated
      }));
    }
  }

  // Combine suggestions: AI suggestions + pattern-matching suggestions
  const combinedSuggestions = [
    ...aiSuggestions.slice(0, 3), // Top 3 AI suggestions
    ...patternAnalysis.suggestions.filter(
      (s) =>
        !aiSuggestions.some(
          (ai) => ai.category === s.category && ai.title.includes(s.title.split(":")[0])
        )
    ),
  ];

  // Boost score if AI validation confirms quality areas
  let adjustedScore = patternAnalysis.score;
  if (aiSuggestions.length === 0) {
    adjustedScore = Math.min(100, patternAnalysis.score + 5); // Small bonus if AI finds nothing to improve
  }

  return {
    suggestions: combinedSuggestions.slice(0, 8), // Return up to 8 suggestions
    score: Math.round(adjustedScore),
    wordCount: patternAnalysis.wordCount,
    skillsFound: patternAnalysis.skillsFound,
    metricsFound: patternAnalysis.metricsFound,
    sectionCount: patternAnalysis.sectionCount,
    aiPowered: aiSuggestions.length > 0,
  };
};

