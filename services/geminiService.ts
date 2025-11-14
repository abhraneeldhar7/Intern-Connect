import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, this key should come from a secure backend proxy.
// Since this is a client-side demo, we assume the env var is available or handle the missing key gracefully.
const apiKey = process.env.API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateJobDescription = async (title: string, skills: string): Promise<string> => {
  if (!ai) {
    // Fallback mock response if no API key is set in the demo environment
    return new Promise(resolve => setTimeout(() => resolve(
      `[AI Generated Mock]\n\nRole: ${title}\n\nWe are looking for a passionate individual proficient in ${skills}. You will work closely with our senior team members to deliver high-quality software solutions. This role requires strong problem-solving skills and a willingness to learn.\n\nKey Responsibilities:\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews`
    ), 1500));
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a professional and engaging job description for an internship position titled "${title}". The candidate should have skills in: ${skills}. Keep it concise, around 150 words, focusing on responsibilities and what they will learn.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const analyzeResumeMatch = async (resumeText: string, jobDescription: string): Promise<string> => {
    if (!ai) {
        return "85% Match - Based on keywords (Mock)";
    }
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `Compare the following resume summary with the job description. Give a match percentage and a 1-sentence reason.\n\nResume: ${resumeText}\n\nJob: ${jobDescription}`;
         const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text || "Analysis failed";
    } catch (e) {
        return "Analysis failed";
    }
}