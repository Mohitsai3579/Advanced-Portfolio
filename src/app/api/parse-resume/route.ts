import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";

const pdfParse = require("pdf-parse");

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.portfolioId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured in .env" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Save the file locally
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    const resumeUrl = `/uploads/resumes/${filename}`;

    // 2. Parse PDF Text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    // 3. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert technical recruiter and resume parser.
      Extract the following information from the provided resume text and return it ONLY as a valid, raw JSON object (no markdown formatting, no backticks).
      
      Expected JSON structure:
      {
        "profile": {
          "name": "Full Name",
          "title": "Current/Target Job Title",
          "bio": "A professional 3-sentence summary of their background",
          "linkedinUrl": "LinkedIn URL if found, else empty string",
          "githubUrl": "Github URL if found, else empty string"
        },
        "skills": [
          { "name": "Skill Name (e.g. React)", "category": "Frontend/Backend/Tools/etc", "proficiency": 80 }
        ],
        "experiences": [
          {
            "company": "Company Name",
            "position": "Job Title",
            "location": "City, Country",
            "startDate": "YYYY-MM-DDT00:00:00.000Z",
            "endDate": "YYYY-MM-DDT00:00:00.000Z or null if current",
            "current": true/false,
            "description": "Paragraph format of achievements",
            "technologies": ["React", "Node"]
          }
        ],
        "projects": [
          {
            "title": "Project Name",
            "description": "Brief description of what it does",
            "technologies": ["React", "Node"]
          }
        ],
        "educations": [
          {
            "institution": "University/School Name",
            "degree": "Degree (e.g. Bachelor of Science)",
            "fieldOfStudy": "Field of Study (e.g. Computer Science)",
            "startDate": "YYYY-MM-DDT00:00:00.000Z",
            "endDate": "YYYY-MM-DDT00:00:00.000Z or null if current",
            "current": true/false,
            "description": "Details about activities or coursework"
          }
        ]
      }

      Resume Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (responseText.startsWith("\`\`\`")) {
      responseText = responseText.replace(/\`\`\`/g, "").trim();
    }

    const parsedJson = JSON.parse(responseText);

    // 4. Save parsed data to Portfolio
    await prisma.portfolio.update({
      where: { id: session.user.portfolioId },
      data: { parsedResume: parsedJson }
    });

    return NextResponse.json({ 
      data: parsedJson,
      resumeUrl: resumeUrl
    });
  } catch (error: any) {
    console.error("Resume parsing error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 });
  }
}
