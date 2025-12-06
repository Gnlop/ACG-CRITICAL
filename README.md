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
<div class="scoring-model">

  <h2>Scoring Model &amp; ABBF Engine</h2>

  <p>
    This section documents the <strong>exact scoring logic</strong> encoded in
    <code>constants.ts</code> and <code>types.ts</code> – how X-Critical turns
    Gemini’s reasoning + online data into a final <strong>IN / OUT</strong> verdict.
  </p>

  <p>
    X-Critical always works in a 6-dimensional space:
    <code>(E, A, C, O, U, R)</code> where each dimension is in <code>[0.0, 5.0]</code>
    with a step of <code>0.5</code>.
  </p>

  <ul>
    <li><strong>E</strong> – Logos / 理性</li>
    <li><strong>A</strong> – Pathos / 情感</li>
    <li><strong>C</strong> – Techne / 工艺</li>
    <li><strong>O</strong> – Originality / 原创</li>
    <li><strong>U</strong> – Unity / 一致性</li>
    <li><strong>R</strong> – Resonance / 残响</li>
  </ul>

  <h3>1. Base weights &amp; composite score</h3>

  <p>All 6 dimensions share a fixed weight vector (from <code>constants.ts</code>):</p>

  <p>
    <code>
      w = (w_E, w_A, w_C, w_O, w_U, w_R)
      = (0.25, 0.25, 0.20, 0.15, 0.10, 0.05)
    </code>
  </p>

  <p>
    Given any score vector <code>s = (E, A, C, O, U, R)</code>, the raw weighted
    composite score <code>S</code> is:
  </p>

  <p>
    <code>
      S = 0.25 * E + 0.25 * A + 0.20 * C + 0.15 * O + 0.10 * U + 0.05 * R
    </code>
  </p>

  <p>In JSON, the indices field stores:</p>

  <ul>
    <li><code>indices.S</code> – raw weighted score in <code>[0.0, 5.0]</code></li>
    <li><code>indices.S_adj</code> – adjusted score in <code>[0.0, 100.0]</code></li>
  </ul>

  <p>The mapping is linear:</p>

  <p><code>S_adj = S * 20</code></p>

  <blockquote>
    <p>
      X-Critical never exposes the 0–5 score as a “global rating”. Only
      <code>S_adj</code> (0–100) is used for UI and exports; the 0–5 values are
      internal building blocks.
    </p>
  </blockquote>

  <h3>2. Extreme thresholds (A / B / C classes)</h3>

  <p>
    A work must pass at least one extreme threshold to be eligible for
    <strong>IN</strong>.
  </p>

  <h4>Class A – Logos extreme (理性极致)</h4>

  <ul>
    <li><code>E &gt;= 4.5</code></li>
    <li><code>U &gt;= 4.0</code></li>
    <li><code>O &gt;= 4.0</code> (or a strongly justified reinterpretation)</li>
  </ul>

  <h4>Class B – Pathos / flavor extreme (情感 / 风味极致)</h4>

  <p>Main route:</p>
  <ul>
    <li><code>A &gt;= 4.5</code></li>
    <li><code>U &gt;= 4.0</code></li>
    <li><code>O &gt;= 4.0</code> (or strongly justified)</li>
  </ul>

  <p>Flavor route (B'):</p>
  <ul>
    <li><code>R &gt;= 4.5</code></li>
    <li><code>U &gt;= 4.0</code></li>
    <li><code>C &gt;= 4.5</code> or <code>A &gt;= 4.0</code></li>
    <li><code>O &gt;= 3.5</code> (or a stable mechanism)</li>
  </ul>

  <h4>Class C – Dual peak (双巅峰)</h4>

  <ul>
    <li><code>E &gt;= 4.0</code></li>
    <li><code>A &gt;= 4.0</code></li>
    <li><code>C &gt;= 4.5</code></li>
    <li><code>U &gt;= 4.2</code></li>
  </ul>

  <p>
    If final scores (after ABBF) satisfy any of A/B/C, <code>verdict_basis</code>
    is set accordingly and the work may become <strong>IN</strong>. If a work
    fails all three, it is forced <strong>OUT</strong> even if the average
    looks “fine”.
  </p>

  <h3>3. Phase 1 – Local analysis (isolation mode)</h3>

  <p>
    Gemini judges the work in isolation, using only its internal knowledge.
    No searching, no ABBF, no external opinions.
  </p>

  <p>Conceptually:</p>

  <pre><code>// Phase 1 output
scores_local: Scores;  // (E_loc, A_loc, C_loc, O_loc, U_loc, R_loc)
indices.S: number;     // weighted S from scores_local
indices.S_adj: number; // S * 20
source_analysis: {
  local_confidence: number;   // how solid the internal knowledge is
  online_confidence: 0;       // not used yet
  blending_coefficient: 0;    // Omega not applied yet
  consensus_reliability: 'Low';
  bandwagon_penalty_detected: false;
  moral_controversy_factor: 0;
}</code></pre>

  <p>
    At this stage, the UI shows the <strong>Local Model</strong> card
    (<code>MODE: LOCAL</code>) and uses only <code>scores_local</code> to compute
    <code>indices.S</code> and <code>S_adj</code>.
  </p>

  <h3>4. Phase 2 – Online analysis (network mode)</h3>

  <p>
    The second phase unlocks tools and lets Gemini:
  </p>

  <ul>
    <li>search for reviews / wikis / discussions,</li>
    <li>estimate opinion distributions and polarization,</li>
    <li>detect possible review bombing or moral panic.</li>
  </ul>

  <p>Output:</p>

  <pre><code>scores_online: Scores;  // (E_net, A_net, C_net, O_net, U_net, R_net)

source_analysis: SourceAnalysis = {
  local_confidence: number;         // 0.0–1.0
  online_confidence: number;        // 0.0–1.0
  blending_coefficient: number;     // global Omega summary
  conflict_notes: string;

  consensus_reliability: 'High' | 'Medium' | 'Low';
  bandwagon_penalty_detected: boolean;
  moral_controversy_factor: number; // 0.0–1.0
}</code></pre>

  <p>
    A network composite score <code>S_net</code> is computed from
    <code>scores_online</code> using the same weights, and internally mapped to
    <code>S_net_adj = S_net * 20</code>. These are input to ABBF and are not
    exposed as a final rating.
  </p>

  <h3>5. ABBF (Adaptive Bayesian-Bandwagon Filtering)</h3>

  <p>
    ABBF decides how much to trust the crowd vs. the local model.
  </p>

  <h4>5.1 Base Omega from consensus reliability</h4>

  <p>From <code>consensus_reliability</code>:</p>

  <ul>
    <li><code>High   → omega_base = 0.8</code> (strong consensus, trust network more)</li>
    <li><code>Medium → omega_base = 0.6</code></li>
    <li><code>Low    → omega_base = 0.3</code> (highly polarizing, fall back to local)</li>
  </ul>

  <h4>5.2 Taboo Tax (bandwagon / moral penalty)</h4>

  <p>
    If the local model gives high E/A but the network gives low E/A because
    of sensitive themes (ethics, violence, politics, etc.), ABBF enters a
    "Taboo Tax" mode:
  </p>

  <ul>
    <li><code>bandwagon_penalty_detected = true</code></li>
    <li><code>moral_controversy_factor</code> is raised</li>
    <li>
      for subjective dimensions (E, A, R) we reduce omega and may force
      <code>omega_subj ≈ 0.1</code>:
      “almost ignore the network on Logos / Pathos / Resonance”.
    </li>
    <li>
      objective dimensions (C, U) keep <code>omega_base</code>, because craft
      and pacing criticism is still valid even for masterpieces.
    </li>
  </ul>

  <h4>5.3 Final per-dimension Omega</h4>

  <p>
    For each dimension <code>d</code> in <code>{E, A, C, O, U, R}</code>,
    ABBF computes:
  </p>

  <p>
    <code>
      omega_d = Clamp(omega_base + AgeFactor - ControversyPenalty, 0.1, 0.9)
    </code>
  </p>

  <p>
    AgeFactor and ControversyPenalty come from the hybrid analysis prompt
    (work age, stability of reputation, moral_controversy_factor, etc.).
  </p>

  <p>
    Subjective dims (E/A/R) tend to get lower omega when taboo effects are detected;
    objective dims (C/U) can keep relatively high omega if craft is broadly agreed upon.
  </p>

  <p>
    The global <code>blending_coefficient</code> in the UI is an aggregated summary
    of all <code>omega_d</code>.
  </p>

  <h4>5.4 Final blended scores</h4>

  <p>For each dimension:</p>

  <p>
    <code>
      d_final = (1 - omega_d) * d_local + omega_d * d_net
    </code>
  </p>

  <p>
    The final score vector is:
    <code>(E_fin, A_fin, C_fin, O_fin, U_fin, R_fin)</code>.
  </p>

  <p>
    The final composite score is computed from these final scores using the same
    weights, then mapped to <code>S_final_adj = S_final * 20</code>.
  </p>

  <p>In JSON:</p>

  <pre><code>scores        // final, blended scores
scores_local  // Phase 1 snapshot
scores_online // Phase 2 snapshot

indices.S     // S_final, 0–5
indices.S_adj // S_final * 20, 0–100</code></pre>

  <h3>6. Final IN / OUT decision</h3>

  <ol>
    <li>Compute <code>scores_local</code> and <code>S / S_adj</code> from phase 1.</li>
    <li>Compute <code>scores_online</code> and <code>SourceAnalysis</code> from phase 2.</li>
    <li>Run ABBF to get final <code>scores</code> and updated <code>S / S_adj</code>.</li>
    <li>
      Check A / B / C extreme thresholds using the final scores:
      <ul>
        <li>If any class is satisfied → candidate <strong>IN</strong>, with <code>verdict_basis</code> set to 'A' / 'B' / 'C'.</li>
        <li>Otherwise → forced <strong>OUT</strong>.</li>
      </ul>
    </li>
    <li>
      The UI then renders: verdict badge (IN/OUT), basis class, radar chart
      (local/online/final) and source weighting based on <code>SourceAnalysis</code>.
    </li>
  </ol>

  <blockquote>
    <p><strong>Local</strong> = “how good the work really is, text-in-itself”.<br />
       <strong>Online</strong> = “how the world currently treats it”.<br />
       <strong>ABBF</strong> = “how much we should listen to the crowd”.<br />
       <strong>IN / OUT</strong> = “does it reach any genuine extremity, or is it just lukewarm”.</p>
  </blockquote>

</div>


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
