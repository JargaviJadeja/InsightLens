# InsightLens — AI Evidence & Insight Explorer

> An AI-powered evidence analysis tool that helps users examine documents, extract factual claims, identify potentially problematic assertions, and investigate them using Gemini and Google Search grounding.

InsightLens analyzes PDFs, images, and text using multimodal AI. It decomposes documents into atomic claims, prioritizes claims that require scrutiny, and uses grounded web search to assess whether claims are supported, contradicted, or still require verification.

---

## ✨ Key Features

- 📄 Multimodal document analysis
- 🧩 Atomic claim extraction
- 🛡️ Challenge Mode for adversarial scrutiny
- 🎯 Claim prioritization
- 🔎 Google Search grounding
- ✅ Supported / ❌ Contradicted / ⚠️ Needs Verification / ❔ Inconclusive outcomes
- 📚 Evidence and source presentation
- 💬 Ask InsightLens for follow-up investigation
- 📑 Analysis dossier generation
- 🌓 Light and dark theme

---

## 🧠 How It Works

Document
↓
Gemini Multimodal Analysis
↓
Atomic Claim Extraction
↓
Risk & Uncertainty Classification
↓
Challenge Mode
↓
Google Search Grounding
↓
Evidence Assessment
↓
Verified Insight

> **AI should not automatically assume that a claim is true. It should investigate the claim and show the evidence.**

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│         User Interface        │
│          React / Vite         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Express Backend        │
│          server.ts            │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌──────────────────┐
│   Gemini API  │  │  Google Search   │
│ Gemini 2.5    │  │    Grounding     │
│    Flash      │  │                  │
└───────┬───────┘  └────────┬─────────┘
        │                    │
        └──────────┬─────────┘
                   ▼
          Evidence & Insights
```

Gemini API calls are handled by the server-side backend. The Gemini API key is accessed through server-side environment variables and should never be exposed in frontend code.

---

## 🛠️ Tech Stack

- TypeScript
- React
- Vite
- Express
- Google GenAI SDK (`@google/genai`)
- Gemini 2.5 Flash
- Google Search grounding
- HTML / CSS

---

## 🔌 API Endpoints

### `POST /api/analyze`

Analyzes uploaded documents and generates structured insights, claims, entities, and questions.

### `POST /api/challenge`

Performs adversarial claim analysis and uses Google Search grounding to investigate claims requiring verification.

### `POST /api/chat`

Provides follow-up conversational investigation with optional Google Search grounding.

---

## 🔍 Verification Model

InsightLens deliberately avoids treating every extracted statement as automatically true.

Claims can receive different verification outcomes:

### ✅ Supported

Relevant external evidence supports the claim.

### ❌ Contradicted

Reliable evidence conflicts with the claim.

### ⚠️ Needs Verification

The claim requires additional evidence or cannot currently be independently established.

### ❔ Inconclusive

Available evidence is insufficient to determine whether the claim is correct.

Internal experiments and proprietary performance metrics may not be independently verifiable through public web sources.

---

## 🔎 Google Search Grounding

InsightLens uses Google's Search grounding capability through the Gemini API to investigate claims against external web information.

The system can:

1. Extract an individual claim.
2. Generate a targeted search query.
3. Ground Gemini's response with Google Search.
4. Examine available evidence.
5. Return a verification assessment.
6. Surface relevant sources and citations.

This allows the application to move beyond simple document summarization toward evidence-oriented analysis.

---

## 🔐 Security

The Gemini API key is accessed server-side through:

```text
GEMINI_API_KEY
```

The API key should never be committed to the repository or exposed in frontend code.

For local development, configure the key through environment variables.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

> **Never commit real API keys, credentials, or other secrets to GitHub.**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JargaviJadeja/InsightLens.git
cd InsightLens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create a `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Start the development server

```bash
npm run dev
```

The available development scripts are defined in `package.json`.

---

## 🌐 Live Demo

### [Launch InsightLens](https://insightlens-jv.ai.studio)

Try the live application to upload a document, extract claims, challenge assertions, and investigate evidence using Gemini and Google Search grounding.

---

## 📸 Screenshots

Screenshots of the following application features will be added here:

- Main analysis dashboard
- Challenge Mode
- Claim verification results
- Ask InsightLens
- Evidence and source presentation

---

## 🎯 Project Motivation

Documents can contain factual claims, unsupported statistics, outdated information, assumptions, and contradictory statements.

Traditional document analysis often focuses primarily on summarization.

InsightLens explores a different approach:

> **Extract the claims first. Then investigate the claims.**

The goal is to help users identify which statements deserve attention and provide an evidence-oriented path toward independent verification.

---

## 🧪 Example Analysis Flow

```text
Factual Claim
      ↓
Extract as Atomic Claim
      ↓
Assess Risk & Uncertainty
      ↓
Challenge Mode
      ↓
Google Search Grounding
      ↓
External Evidence
      ↓
Verification Assessment
```

For example, a publicly documented historical fact may receive a **Supported** assessment, while a proprietary internal performance metric may receive **Needs Verification** because public web sources cannot independently validate the experiment.

---

## 🔮 Future Improvements

- Better source ranking and reliability scoring
- More sophisticated claim decomposition
- Citation quality scoring
- Claim history and comparison
- Additional document formats
- Larger evaluation benchmarks
- Improved evidence synthesis
- More advanced contradiction detection

---

## ⚠️ Disclaimer

InsightLens is an **independent project** and is **not an official Google product**.

Google Gemini and Google Search grounding are used as underlying technologies.

Verification results should be treated as research assistance and should be evaluated against authoritative sources when making important decisions.

---

## 👩‍💻 Author

**Jargavi Jadeja**

---

## ⭐ Project

**InsightLens — AI Evidence & Insight Explorer**

Built with **Gemini + Google Search grounding** to explore a more evidence-oriented approach to AI-assisted document analysis.
