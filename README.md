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
  </p>

  <pre><code>\[
\mathbf{s} = (E, A, C, O, U, R) \in [0, 5]^6
\]</code></pre>

  <p>
    with <strong>0.5 step</strong> constraints on each dimension.
  </p>

  <ul>
    <li><strong>E</strong> – Logos / 理性</li>
    <li><strong>A</strong> – Pathos / 情感</li>
    <li><strong>C</strong> – Techne / 工艺</li>
    <li><strong>O</strong> – Originality / 原创</li>
    <li><strong>U</strong> – Unity / 一致性</li>
    <li><strong>R</strong> – Resonance / 残响</li>
  </ul>

  <p>
    Types are defined in <a href="./types.ts"><code>types.ts</code></a>:
  </p>

  <pre><code>export interface Scores {
  E: number;
  A: number;
  C: number;
  O: number;
  U: number;
  R: number;
}

export interface Indices {
  P: number;
  D: number;
  OI: number;
  CI: number;
  RI: number;
  S: number;
  S_adj: number; // 0–100
}</code></pre>

  <p>The main response object is:</p>

  <pre><code>export interface ReviewResult {
  verdict: 'IN' | 'OUT';
  verdict_basis: 'A' | 'B' | 'C' | null;
  title_localized: LocalizedTitle;
  scores: Scores;        // final, ABBF-blended scores
  scores_local?: Scores; // phase 1 (local) scores
  scores_online?: Scores;// phase 2 (online) scores
  indices: Indices;      // including S and S_adj
  // ...
  coefficients: Coefficients;
  source_analysis: SourceAnalysis;
}</code></pre>

  <hr />

  <h3>1. Base weights &amp; composite score</h3>

  <p>
    All 6 dimensions share a <strong>fixed weight vector</strong> 
    (<code>constants.ts</code> → “B.6 基础权重优化”):
  </p>

  <pre><code>\[
\mathbf{w} =
(w_E, w_A, w_C, w_O, w_U, w_R)
= (0.25, 0.25, 0.20, 0.15, 0.10, 0.05)
\]</code></pre>

  <p>
    Given any score vector 
    <code>\(\mathbf{s} = (E, A, C, O, U, R)\)</code>, 
    the <strong>raw weighted score</strong> <code>S</code> is:
  </p>

  <pre><code>\[
S = w_E E + w_A A + w_C C + w_O O + w_U U + w_R R
\quad \in [0, 5]
\]</code></pre>

  <p>
    In JSON, the <code>indices</code> field stores both the raw value and the 0–100 variant:
  </p>

  <ul>
    <li><code>indices.S</code> – raw weighted score in <code>[0.0, 5.0]</code></li>
    <li><code>indices.S_adj</code> – adjusted score in <code>[0.0, 100.0]</code></li>
  </ul>

  <p>
    The mapping is linear (<code>constants.ts</code> → “B.7 指数计算标准”):
  </p>

  <pre><code>\[
S_{\text{adj}} = S \times 20
\]</code></pre>

  <blockquote>
    <p>
      Constraint: <strong>X-Critical never exposes 0–5 scores as a “global rating”</strong> – 
      only <code>S_adj</code> (0–100) is used for UI and exports. The 0–5 values are internal
      building blocks.
    </p>
  </blockquote>

  <hr />

  <h3>2. Extreme thresholds (A/B/C classes)</h3>

  <p>
    X-Critical is <strong>not</strong> a generic 0–100 recommender.
    A work must first pass at least one <strong>extreme threshold</strong> (“A.5 极致阈值”) 
    to even be eligible for <strong>IN</strong>:
  </p>

  <ol>
    <li>
      <p><strong>Class A – Logos extreme (理性极致)</strong></p>
      <pre><code>\[
E \ge 4.5,\quad
U \ge 4.0,\quad
O \ge 4.0 \ \text{(or strongly justified reinterpretation)}
\]</code></pre>
    </li>

    <li>
      <p><strong>Class B – Pathos / flavor extreme (情感 / 风味极致)</strong></p>

      <p>Main route:</p>
      <pre><code>\[
A \ge 4.5,\quad
U \ge 4.0,\quad
O \ge 4.0 \ \text{(or strongly justified)}
\]</code></pre>

      <p>Flavor route (<strong>B’</strong>):</p>
      <pre><code>\[
R \ge 4.5,\quad
U \ge 4.0,\quad
(C \ge 4.5 \ \text{or}\ A \ge 4.0),\quad
O \ge 3.5 \ \text{(or stable mechanism)}
\]</code></pre>
    </li>

    <li>
      <p><strong>Class C – Dual peak (双巅峰)</strong></p>
      <pre><code>\[
E \ge 4.0,\quad
A \ge 4.0,\quad
C \ge 4.5,\quad
U \ge 4.2
\]</code></pre>
    </li>
  </ol>

  <p><strong>Rule of thumb:</strong></p>

  <ul>
    <li>
      If the final scores (after ABBF, see below) satisfy <strong>A / B / C</strong> → 
      <code>verdict_basis</code> is set accordingly and the work <em>may</em> become <strong>IN</strong>.
    </li>
    <li>
      If the work fails <strong>all three</strong>, it is automatically <strong>OUT</strong>, 
      no matter how “ok” the average looks.
    </li>
  </ul>

  <p>
    This is how X-Critical “kills lukewarm works” and only keeps genuinely <strong>extreme</strong> ones.
  </p>

  <hr />

  <h3>3. Phase 1 – Local analysis (isolation mode)</h3>

  <p>
    <strong>Goal:</strong> Let Gemini judge the work <strong>in isolation</strong>, using only its internal
    knowledge and semantics. No searching, no ABBF, no “what the internet thinks”.
  </p>

  <p>Conceptually:</p>

  <pre><code>// Phase 1 output
scores_local: Scores;  // (E_loc, A_loc, C_loc, O_loc, U_loc, R_loc)
indices.S: number;     // weighted S from scores_local
indices.S_adj: number; // S * 20
source_analysis: {
  local_confidence: number;   // ~ how solid the internal knowledge is
  online_confidence: 0;       // not used yet
  blending_coefficient: 0;    // Omega not applied yet
  consensus_reliability: 'Low';
  bandwagon_penalty_detected: false;
  moral_controversy_factor: 0;
}</code></pre>

  <p>Mathematically, for phase 1:</p>

  <pre><code>\[
\mathbf{s}_{\text{local}} = (E_{loc}, A_{loc}, C_{loc}, O_{loc}, U_{loc}, R_{loc})
\]

\[
S_{\text{local}} = \sum_d w_d \, d_{loc}, \quad
S_{\text{local,adj}} = 20 \cdot S_{\text{local}}
\]</code></pre>

  <p>
    At this stage, the UI can already show a <strong>Local Model</strong> card labeled as 
    <code>MODE: LOCAL</code>.
  </p>

  <hr />

  <h3>4. Phase 2 – Online analysis (network mode)</h3>

  <p>
    Phase 2 unlocks tools and makes Gemini:
  </p>

  <ul>
    <li>search for reviews / wikis / discussions</li>
    <li>estimate opinion distribution &amp; polarization</li>
    <li>detect possible <strong>review bombing / taboo bias</strong></li>
  </ul>

  <p>
    The output is a second 6-D vector plus meta-signals:
  </p>

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
    The <strong>network composite</strong> is computed with the same weights:
  </p>

  <pre><code>\[
\mathbf{s}_{\text{net}} = (E_{net}, A_{net}, C_{net}, O_{net}, U_{net}, R_{net})
\]

\[
S_{\text{net}} = \sum_d w_d \, d_{net}, \quad
S_{\text{net,adj}} = 20 \cdot S_{\text{net}}
\]</code></pre>

  <p>
    These are used only as an <strong>input</strong> to the ABBF engine; they are never exposed as a standalone
    “final rating”.
  </p>

  <hr />

  <h3>5. ABBF (Adaptive Bayesian-Bandwagon Filtering)</h3>

  <p>
    ABBF is the core of the hybrid mode: it decides <strong>how much to trust the crowd</strong> vs. the local model.
  </p>

  <h4>5.1 Base Omega from consensus reliability</h4>

  <p>
    From <code>consensus_reliability</code> (“High / Medium / Low”):
  </p>

  <pre><code>High   → ω_base = 0.8   // strong consensus, trust the network more
Medium → ω_base = 0.6
Low    → ω_base = 0.3   // highly polarizing, fall back to local</code></pre>

  <p>
    (these values come directly from <code>constants.ts</code> → “B.8 自适应贝叶斯-跟风过滤算法”)
  </p>

  <h4>5.2 Taboo Tax (bandwagon / moral penalty)</h4>

  <p>
    When the local model sees a strong core but the network score is low <strong>because of topic taboos</strong>,
    ABBF switches into a protective mode (“Taboo Tax”):
  </p>

  <p>If:</p>

  <ul>
    <li><code>Score_Local(A or E) &gt; 4.0</code> <strong>and</strong></li>
    <li><code>Score_Online(A or E) &lt; 3.0</code> <strong>and</strong></li>
    <li>
      the work contains <strong>sensitive themes</strong> (ethics, violence, politics, etc.),
    </li>
  </ul>

  <p>then:</p>

  <ul>
    <li><code>bandwagon_penalty_detected = true</code></li>
    <li><code>moral_controversy_factor</code> is raised</li>
    <li>
      for <strong>subjective dimensions</strong> (E, A, R) we force:
      <pre><code>\[
\omega_{\text{subj}} = 0.1
\]</code></pre>
      <p>
        “Almost ignore the network on Logos / Pathos / Resonance; trust the internal reading of the text.”
      </p>
    </li>
    <li>
      <strong>Objective dimensions</strong> (C, U) keep the original 
      <code>\(\omega_{base}\)</code>. Bad art or pacing is still a valid criticism even for masterpieces.
    </li>
  </ul>

  <h4>5.3 Final per-dimension Omega</h4>

  <p>
    For each dimension <code>d ∈ {E, A, C, O, U, R}</code>, the engine computes:
  </p>

  <pre><code>\[
\omega_d = \mathrm{Clamp}(
  \omega_{base} + \text{AgeFactor} - \text{ControversyPenalty},
  0.1,\ 0.9
)
\]</code></pre>

  <ul>
    <li>
      AgeFactor / ControversyPenalty are derived from the hybrid analysis prompt
      (age of the work, stability of reputation, <code>moral_controversy_factor</code>, etc.).
    </li>
    <li>Subjective dims (E/A/R) are pushed <strong>down</strong> when taboo effects are detected.</li>
    <li>Objective dims (C/U) are allowed to stay <strong>high</strong> if the craft is broadly agreed upon.</li>
  </ul>

  <p>
    The <strong>global</strong> <code>blending_coefficient</code> displayed in the UI is a summary of these 
    <code>\(\omega_d\)</code> values.
  </p>

  <h4>5.4 Final blended scores</h4>

  <p>For each dimension:</p>

  <pre><code>\[
d_{\text{final}} =
(1 - \omega_d) \cdot d_{\text{local}}
+ \omega_d \cdot d_{\text{net}}
\]</code></pre>

  <p>Collecting them:</p>

  <pre><code>\[
\mathbf{s}_{\text{final}} =
(E_{fin}, A_{fin}, C_{fin}, O_{fin}, U_{fin}, R_{fin})
\]

\[
S_{\text{final}} = \sum_d w_d \, d_{fin}, \quad
S_{\text{final,adj}} = 20 \cdot S_{\text{final}}
\]</code></pre>

  <p>In the final JSON:</p>

  <pre><code>scores        // = s_final (what the UI shows as main 6-dim scores)
scores_local  // = s_local  (Phase 1 snapshot)
scores_online // = s_net    (Phase 2 snapshot)

indices.S     // = S_final
indices.S_adj // = S_final * 20</code></pre>

  <hr />

  <h3>6. Final IN / OUT decision</h3>

  <p><strong>Putting it all together:</strong></p>

  <ol>
    <li>
      <strong>Compute</strong> <code>scores_local</code> and 
      <code>indices.S/S_adj</code> from phase 1.
    </li>
    <li>
      <strong>Compute</strong> <code>scores_online</code> + 
      <code>SourceAnalysis</code> from phase 2.
    </li>
    <li>
      <strong>Run ABBF</strong> to get <code>scores</code> (final) + updated 
      <code>indices.S/S_adj</code>.
    </li>
    <li>
      <strong>Check extreme thresholds</strong> (A/B/C) using the 
      <strong>final scores</strong>:
      <ul>
        <li>
          If any of A / B / C is satisfied → candidate <strong>IN</strong>.
          <ul>
            <li><code>verdict_basis = 'A' | 'B' | 'C'</code> accordingly.</li>
          </ul>
        </li>
        <li>
          Otherwise → forced <strong>OUT</strong> (<code>verdict = 'OUT'</code>).
        </li>
      </ul>
    </li>
    <li>
      The UI then renders:
      <ul>
        <li>a verdict badge (<strong>IN / OUT</strong>),</li>
        <li>the basis (<strong>A / B / C class</strong>),</li>
        <li>a radar chart for local / online / final scores,</li>
        <li>
          and a <strong>Source Weighting</strong> box using <code>SourceAnalysis</code>
          (local vs online confidence, consensus level, taboo flags, etc.).
        </li>
      </ul>
    </li>
  </ol>

  <p>In short:</p>

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
