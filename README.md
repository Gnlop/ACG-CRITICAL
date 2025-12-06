<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="X-Critical Banner" width="100%" />

  <h1 style="font-size: 3rem; font-weight: bold; margin-top: 20px;">X-Critical</h1>
  
  <p style="font-size: 1.2rem; font-style: italic;">
    The Extreme Media Screener
  </p>
  
  <p>
    <strong>Rigorous, Anti-Inflationary AI Media Analysis powered by Gemini 3.0 Pro & ABBF Algorithm</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Model-Gemini_3.0_Pro-4E79A7?style=flat-square&logo=google-gemini&logoColor=white" alt="Gemini 2.0 Pro">
    <img src="https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
    <img src="https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
  </p>
</div>

---

## 📖 Introduction

**X-Critical** is a specialized AI evaluation system designed to combat "score inflation" and "mediocrity" in media reviews (Anime, Manga, Visual Novels, Novels). 

Unlike traditional review aggregators that average user scores, X-Critical employs a strict, philosophy-driven algorithm to filter for masterpieces that achieve extremity in either **Logos (Reason)** or **Pathos (Emotion)**.

It utilizes a **Hybrid Architecture** combining Gemini 3.0 Pro's internal knowledge base with real-time Google Search grounding, orchestrated by the custom **ABBF (Adaptive Bayesian-Bandwagon Filtering)** algorithm to detect and mitigate review bombing or controversial bias.

> 🌐 **Global Accessibility**: The frontend engine delivers native, culturally-nuanced output in **English, Chinese (Simplified), and Japanese**, ensuring critical analysis bridges language barriers.

<p align="center">
  <img src="https://img.shields.io/badge/Lang-English-blue?style=flat-square&logo=google-translate&logoColor=white">
  <img src="https://img.shields.io/badge/Lang-中文-red?style=flat-square&logo=google-translate&logoColor=white">
  <img src="https://img.shields.io/badge/Lang-日本語-white?style=flat-square&logo=google-translate&logoColor=black">
</p>

<br/>
<div align="center">
  <h2>📸 Workflow Showcase</h2>
  
  <h3>1. Start / Search</h3>
  <img src="https://github.com/Gnlop/ACG-CRITICAL/raw/main/start.png" alt="Start Screen" width="90%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />

  <br/><br/>
  <p style="font-size: 1.5rem;">⬇️ <i>ABBF Algorithm Processing...</i> ⬇️</p>
  <br/>

  <h3>2. Critical Analysis Result</h3>
  <img src="https://github.com/Gnlop/ACG-CRITICAL/raw/main/X-Critical-Nukitashi_the_Animation.jpg" alt="Analysis Result" width="45%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
  
  <p><em>Figure 1: From search query to detailed 6-dimensional report.</em></p>
</div>
<br/>

---

## 🧠 Core Philosophy & Logic

The system rejects the "Jack-of-all-trades" approach. 
> *A work with no flaws but no soul is rejected (**OUT**).* > *A work with significant flaws but a transcendent core is accepted (**IN**).*

### 1. The 6-Dimensional Metric (0.0 - 5.0)

| Symbol | Metric | Definition |
| :---: | :--- | :--- |
| **E** | **Logos / Reason** | Logical consistency, philosophical depth, thematic complexity. |
| **A** | **Pathos / Emotion** | Character arcs, emotional resonance, catharsis. |
| **C** | **Techne / Craft** | Narrative structure, pacing, audiovisual execution. |
| **O** | **Originality** | Novelty, boundary-pushing concepts, unique twists. |
| **U** | **Unity** | Pacing consistency, narrative closure, lack of plot holes. |
| **R** | **Resonance** | Post-completion impact, re-watch value, "brain rot" factor. |

### 2. The ABBF Algorithm
**Adaptive Bayesian-Bandwagon Filtering**

This is the core risk-control engine designed to handle **polarized masterpieces** (e.g., *Yosuga no Sora*, *Mushoku Tensei*) which often suffer from moralistic review bombing.

#### 🔄 Logic Flow
1.  **Consensus Check**: The system analyzes the distribution of online search results.
    * **High Consensus**: Trust the wisdom of the crowd ($\alpha \approx 1$).
    * **Polarized**: Distrust the crowd ($\alpha \to 0$), rely on local AI judgment.
2.  **Taboo Tax Detection**: If a work scores high in Local Analysis (`E/A > 4.5`) but low Online, and contains sensitive themes (Taboo, Gore, Politics), the system flags it as `"Review Bombing"`.

#### ⚖️ Dynamic Weighting
* **Objective Metrics (C/U)**: Heavily weighted towards **Online Consensus** (masses rarely lie about animation quality).
* **Subjective Metrics (E/A/R)**: Heavily weighted towards **Local AI** (masses often fail to understand nuance in controversial works).

---

## 🛠️ Prompt Design & Engineering

The prompt architecture is split into two distinct stages to ensure data purity.

### Stage 1: Local Analysis (Isolation Mode)
* **Goal**: Extract the model's "unbiased" internal knowledge without noise from the internet.
* **Technique**: `tools: []` (No tools allowed).
* **Prompt Key**:
    > "Assume your internal knowledge is absolute truth. Ignore public opinion."

### Stage 2: Hybrid Analysis (Calibration Mode)
* **Goal**: Calibrate scores against reality and apply ABBF.
* **Technique**: `tools: [{ googleSearch: {} }]`.
* **Prompt Key**:
    > "Analyze the DISTRIBUTION of opinions, not just the average."
    > "Detect 'Moral Panic' or 'Review Bombing'."
    > "Calculate blending coefficient Omega."
* **Data Control**: The prompt explicitly forces the model to output a JSON structure containing `source_analysis` metadata to visualize *why* it made a decision (e.g., `"Taboo Tax Detected: 80%"`).

---

## 💻 Tech Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS
* **UI Components**: Lucide React, Recharts
* **AI Backend**: Google Gemini API (Gemini 3.0 Pro Preview)
* **Build Tool**: Vite

---

# Run in AI Studio app

View  in AI Studio: [https://ai.studio/apps/drive/1aeP_3AwuxSLZ50LN4lU3J3oWht95j3rJ](https://ai.studio/apps/drive/1aeP_3AwuxSLZ50LN4lU3J3oWht95j3rJ)

---

## 🚀 Running Locally

### Prerequisites
* Node.js 18+

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Gnlop/ACG-CRITICAL.git](https://github.com/Gnlop/ACG-CRITICAL.git)
    cd ACG-CRITICAL
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the app**
    ```bash
    npm run dev
    ```

---

## ⚖️ Disclaimer

> [!WARNING]
> **Subjectivity**: This tool uses AI to simulate critical analysis. While rigorous, it is ultimately an emulation of subjective critique.

> [!NOTE]
> **Hallucinations**: Like all LLMs, Gemini may occasionally hallucinate plot details or studio information, especially for obscure works.

> [!TIP]
> **Scoring**: The scores are algorithmically generated estimates and should not be taken as absolute objective truth.

---

<div align="center">
  <sub>Built with ❤️ by Gnlop using Google Gemini API</sub>
</div>
