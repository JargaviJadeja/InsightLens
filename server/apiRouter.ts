import express, { Request, Response, Router } from "express";
import {
  analyzeDocumentContent,
  verifyClaimWithSearchGrounding,
  chatFollowUp,
  AnalyzePayload,
} from "./geminiService.ts";

export const apiRouter: Router = express.Router();

// Parse JSON payloads up to 50MB for file uploads
apiRouter.use(express.json({ limit: "50mb" }));
apiRouter.use(express.urlencoded({ extended: true, limit: "50mb" }));

apiRouter.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post("/analyze", async (req: Request, res: Response) => {
  try {
    const payload: AnalyzePayload = req.body;
    if (!payload.text && (!payload.file || !payload.file.base64)) {
      return res.status(400).json({ error: "Please provide either text or an uploaded file to analyze." });
    }

    const result = await analyzeDocumentContent(payload);
    res.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze document with Gemini.",
    });
  }
});

apiRouter.post("/verify-claim", async (req: Request, res: Response) => {
  try {
    const { claim, context, searchQuery, claimId, documentContext } = req.body;
    if (!claim || typeof claim !== "string") {
      return res.status(400).json({ error: "Claim text is required." });
    }

    const result = await verifyClaimWithSearchGrounding(
      claim,
      context,
      searchQuery,
      claimId,
      documentContext
    );
    res.json(result);
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({
      error: error.message || "Failed to verify claim with Google Search grounding.",
    });
  }
});

apiRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages, documentContext, useSearchGrounding } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const result = await chatFollowUp(messages, documentContext || "", useSearchGrounding ?? true);
    res.json(result);
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat with Gemini.",
    });
  }
});
