
import { GoogleGenAI } from "@google/genai";
import { ReviewResult, TriviaData, Language } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-3-pro-preview";

const getLanguageName = (lang: Language) => {
  switch (lang) {
    case 'zh': return 'Simplified Chinese (简体中文)';
    case 'en': return 'English';
    case 'ja': return 'Japanese (日本語)';
    default: return 'Simplified Chinese';
  }
};

export const getQuickTrivia = async (title: string, medium: string, lang: Language): Promise<TriviaData> => {
  try {
    const langName = getLanguageName(lang);
    const prompt = `
      Identify the ${medium} titled "${title}".
      Provide a JSON object with the following fields:
      - studio: Name of the production studio or main author.
      - studio_status: Status of the studio (e.g., "Active", "Defunct").
      - key_staff: Names of 1-2 key creators (Director, Writer).
      - production_trivia: A single, interesting, obscure fact about its production (max 40 words).
      
      IMPORTANT: Translate all text values into ${langName}.
      Respond with valid JSON only.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as TriviaData;
  } catch (error) {
    console.warn("Trivia fetch failed:", error);
    return {
      studio: "Unknown",
      studio_status: "Analyzing",
      key_staff: "Processing...",
      production_trivia: "Data unavailable."
    };
  }
};

/**
 * Stage 1: Local Analysis
 * Uses internal knowledge only. No search tools.
 */
export const analyzeLocalWork = async (
  title: string, 
  medium: string, 
  notes: string = "",
  lang: Language
): Promise<ReviewResult> => {
  console.log(`[Frontend] Stage 1 Local Analysis for ${title} in ${lang}...`);

  try {
    const langName = getLanguageName(lang);
    const userMessage = `
      Subject: ${title}
      Medium: ${medium}
      Additional Notes: ${notes}
      Target Language: ${langName}
      
      TASK: Perform a LOCAL PRELIMINARY ANALYSIS based on your internal knowledge ONLY.
      
      INSTRUCTIONS:
      1. IGNORE Module B.8 (ABBF) for now. 
      2. Assume "scores_local" is the absolute truth.
      3. Set "scores_online" to null.
      4. Set "source_analysis.blending_coefficient" to 0.0.
      5. Fill "source_analysis.conflict_notes" with "Pending online verification...".
      6. CRITICAL: All string fields in the JSON output MUST be in ${langName}.
      
      Output ONLY the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // No tools for local analysis
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ReviewResult;

  } catch (error: any) {
    console.error("Local Analysis Failed:", error);
    throw new Error(`Local analysis failed: ${error.message}`);
  }
};

/**
 * Helper to construct the prompt for Hybrid Analysis.
 * Exported so the UI can display it.
 */
export const constructHybridPrompt = (
  title: string, 
  medium: string, 
  localResult: ReviewResult,
  lang: Language
): string => {
  const langName = getLanguageName(lang);
  return `
      Subject: ${title}
      Medium: ${medium}
      Target Language: ${langName}
      
      PREVIOUS LOCAL ANALYSIS (JSON):
      ${JSON.stringify(localResult, null, 2)}
      
      TASK: Perform the FINAL HYBRID ANALYSIS using ABBF (Adaptive Bayesian-Bandwagon Filtering).
      
      INSTRUCTIONS:
      1. Use Google Search to verify the work's reception.
      2. CRITICAL: Analyze the DISTRIBUTION of online opinions. Are they polarizing? (Consensus Reliability).
      3. CRITICAL: Check for "Review Bombing" or "Moral Panic" (e.g., taboo themes causing low scores despite high quality).
      4. EXECUTE Module B.8:
         - Calculate "scores_online" based on search results.
         - Determine Omega based on Consensus Reliability & Taboo Factor.
         - Blend "scores_local" and "scores_online".
      5. Update "source_analysis" with the specific ABBF metrics (consensus_reliability, bandwagon_penalty_detected).
      6. CRITICAL: All string fields in the JSON output MUST be in ${langName}.
      
      Output ONLY the raw JSON object.
    `;
};

/**
 * Stage 2: Hybrid Analysis
 * Uses Google Search + Previous Local Result.
 */
export const analyzeHybridWork = async (
  title: string, 
  medium: string, 
  localResult: ReviewResult,
  lang: Language
): Promise<ReviewResult> => {
  console.log(`[Frontend] Stage 2 Hybrid Analysis for ${title} in ${lang}...`);

  try {
    const userMessage = constructHybridPrompt(title, medium, localResult, lang);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is not compatible with googleSearch tool
      },
    });

    let jsonStr = response.text || "";
    // Clean up markdown if the model ignores the "no markdown" instruction
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();

    if (!jsonStr.startsWith("{")) {
       const start = jsonStr.indexOf("{");
       const end = jsonStr.lastIndexOf("}");
       if (start !== -1 && end !== -1) {
           jsonStr = jsonStr.substring(start, end + 1);
       }
    }

    const result = JSON.parse(jsonStr) as ReviewResult;

    // Attach grounding URLs from metadata
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const urls = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk: any) => ({
          title: chunk.web?.title || "Reference",
          uri: chunk.web?.uri || ""
        }))
        .filter((u: any) => u.uri);
        
      if (urls.length > 0) {
        result.grounding_urls = urls;
      }
    }

    // Ensure we keep the local scores from the previous step if the model messed them up, 
    // but usually we trust the model to return them in the new JSON.
    if (!result.scores_local && localResult.scores_local) {
        result.scores_local = localResult.scores_local;
    }

    return result;

  } catch (error: any) {
    console.error("Hybrid Analysis Failed:", error);
    throw new Error(`Hybrid analysis failed: ${error.message}`);
  }
};
