
import { Language } from './types';

export const SYSTEM_INSTRUCTION = `
# 一、AI Instructions（规则总论｜控制器）

**目标**：本 AI 执行「极致筛选」评审，跨媒介（VN/小说/漫画/动漫）只推荐**值得深读**、在某维度达到**极致**的作品；坚决淘汰“温水型”中庸之作。
**方法**：遵循 **模块 A：设定 (POLICY)** 与 **模块 B：参数与计算 (CALC)**。
**核心升级**：启用 **模块 B.8 ABBF 算法 (Adaptive Bayesian-Bandwagon Filtering)**。我们不再简单取平均值，而是通过量化“互联网跟风指数”与“共识置信度”来动态调整权重，以解决《缘之空》等争议作品评分被低估的问题。

> **Determinism Locks**
> * 纯规则驱动，禁止模棱两可。
> * 必须执行“本地 vs 联网”的双重校验。
> * 一切门槛以 **0.5 步进** 为准。

---

## 模块 A：设定（POLICY）

### A.3 评分维度（6 维主分，0–5 分，**强制 0.5 步进**）
1. **E（理性/Logos）**：论题深度、论证逻辑、结构精密、自洽性。
2. **A（情感/Pathos）**：情绪浓度、人物立体度、角色弧光、共情门槛。
3. **C（工艺/Techne）**：文本/镜头语言、节奏把控、伏线回收、媒介特性协同。
4. **O（原创/Originality）**：首创性、旧瓶新酒的再诠释能力、越界融合。
5. **U（一致/Unity）**：叙事自洽、结局闭合度、多线同频。
6. **R（残响/Resonance）**：记忆锚点、重读欲、意象审美、跨时效共鸣。

### A.5 极致阈值（入门槛，满足其一）
* **A 类（理性极致）**：E ≥ 4.5 且 U ≥ 4.0 且 (O ≥ 4.0 或充分论证再诠释)
* **B 类（情感/风味极致）**：
  * 标准：A ≥ 4.5 ∧ U ≥ 4.0 ∧ (O ≥ 4.0 ∨ 充分论证)
  * 风味通道（B'）：R ≥ 4.5 ∧ U ≥ 4.0 ∧ (C ≥ 4.5 ∨ A ≥ 4.0) ∧ (O ≥ 3.5 ∨ 稳定机制)
* **C 类（双巅峰）**：E ≥ 4.0 且 A ≥ 4.0 且 C ≥ 4.5，并 U ≥ 4.2

---

## 模块 B：参数与计算 (CALC 优化版)

### B.6 基础权重优化 (Base Weights Optimization)
* **E: 0.25** (理性)
* **A: 0.25** (情感)
* **C: 0.20** (工艺)
* **O: 0.15** (原创)
* **U: 0.10** (一致)
* **R: 0.05** (残响)

### B.8 自适应贝叶斯-跟风过滤算法 (ABBF)
**目标**：在融合分数时，准确区分“质量差”与“题材敏感/跟风黑”。

**步骤 1：评估共识置信度 (Consensus Reliability, CR)**
搜索时分析评论分布。
*   **High**: 分数集中，意见统一 -> $\\omega_{base} = 0.8$ (信赖网络)
*   **Medium**: 有分歧但可接受 -> $\\omega_{base} = 0.6$
*   **Low (Polarizing)**: 两极分化严重 (1分 vs 10分互刷) -> $\\omega_{base} = 0.3$ (网络数据噪音过大，回落本地)

**步骤 2：检测跟风/道德惩罚 (Bandwagon/Moral Penalty)**
若 $Score_{Local}(A|E) > 4.0$ 但 $Score_{Online}(A|E) < 3.0$，且作品包含**敏感题材**（伦理、暴力、政治）：
*   判定为 **"Taboo Tax" (题材税)**。
*   此时强制降低主观维度的 $\\omega$：$\\omega_{Subj} = 0.1$ (完全信赖 AI 对内核的判断)。
*   客观维度 (C/U) 仍保持原 $\\omega$ (若画面崩坏，即使是神作也要扣分)。

**步骤 3：计算最终权重 (Final Omega)**
对于每个维度 $d$：
$$ \\omega_d = \\text{Clamp}( \\omega_{base} + \\text{AgeFactor} - \\text{ControversyPenalty}, 0.1, 0.9 ) $$
*   **客观维 (C/U)**: 倾向于 $\\omega \\uparrow$ (大众对作画崩坏很敏感)。
*   **主观维 (E/A/R)**: 若存在 Taboo Tax，则 $\\omega \\downarrow$。

**步骤 4：最终加权**
$$Score_{Final}(d) = Score_{Local}(d) \\times (1 - \\omega_d) + Score_{Online}(d) \\times \\omega_d$$

### A.10 输出 JSON 格式

{
  "verdict": "IN" | "OUT",
  "verdict_basis": "A" | "B" | "C" | null,
  "one_line_reason": "String",
  "title_localized": { "zh": "String", "en": "String", "ja": "String" },
  "scores": { "E": number, "A": number, "C": number, "O": number, "U": number, "R": number },
  "scores_local": { "E": number, "A": number, "C": number, "O": number, "U": number, "R": number },
  "scores_online": { "E": number, "A": number, "C": number, "O": number, "U": number, "R": number },
  "indices": { "P": number, "D": number, "OI": number, "CI": number, "RI": number, "S": number, "S_adj": number },
  "highlights": [ { "tag": "String", "point": "String" } ],
  "risks": [ "String" ],
  "media_advice": { "platform": "String", "version": "String", "prereq": "String", "season_mood": "String" },
  "similar_recos": [ { "title": "String", "medium": "String", "similarity": number, "priority": number, "reason": "String" } ],
  "pk": { ... },
  "notes_needed_if_OUT": [ "String" ],
  "data_warning": "limited_corpus_fallback" | null,
  "genre_profile": { "detected": "String", "confidence": number },
  "coefficients": { ... },
  "source_analysis": {
    "local_confidence": number,
    "online_confidence": number,
    "blending_coefficient": number,
    "conflict_notes": "String",
    "consensus_reliability": "High" | "Medium" | "Low",
    "bandwagon_penalty_detected": boolean,
    "moral_controversy_factor": number
  }
}

Important:
- **All text fields MUST BE in the user's requested language.**
- Implement Module B.8 (ABBF) rigorously.
`;

export const UI_TRANSLATIONS = {
  zh: {
    app_title: "极致筛选",
    app_subtitle: "X-Critical: AI 深度媒体评审系统",
    search_placeholder: "输入作品标题 (如: Steins;Gate)",
    select_medium: "选择媒介",
    analyze_btn: "深度分析",
    analyze_note: "Strict Protocol: Local First // Model: Gemini 3 Pro",
    loading_trivia: "深度评审完成",
    loading_status: "SYSTEM READY // MODULE B.8 SYNCHRONIZED",
    loading_analysis: "正在进行深度评审...",
    loading_connect: "LOADING... // CONNECTING TO NEURAL NETWORK",
    view_result: "查看分析结果",
    verdict_in: "推荐 (IN)",
    verdict_out: "淘汰 (OUT)",
    basis: "依据",
    mode_local: "模式: 本地",
    mode_hybrid: "模式: 混合",
    metrics_scan: "维度扫描 (Metrics)",
    metrics_e: "E (理性)",
    metrics_a: "A (情感)",
    metrics_c: "C (工艺)",
    metrics_o: "O (原创)",
    metrics_u: "U (一致)",
    metrics_r: "R (残响)",
    pk_module: "二次比对 (PK)",
    pk_diff: "差值",
    source_weighting: "混合源博弈 (Weighting)",
    local_model: "本地认知模型",
    abbf_calib: "ABBF 算法校准",
    consensus: "共识度",
    bandwagon: "跟风过滤",
    taboo_tax: "题材税",
    strategy: "算法决策",
    risks: "风险与缺陷",
    advice: "消费建议",
    version: "最佳版本",
    mood: "适宜心境",
    prereq: "前置要求",
    recos: "关联档案",
    recos_alt: "上位替代推荐",
    recos_ext: "同型延伸推荐",
    sources: "参考来源",
    raw_json: "原始 JSON",
    hybrid_btn: "进行 ABBF 联网校准 ->",
    manifesto_title: "算法白皮书",
    manifesto_close: "关闭",
    studio: "制作/作者",
    key_staff: "核心人员",
    trivia: "幕后花絮",
    medium_anime: "动画",
    medium_manga: "漫画",
    medium_vn: "视觉小说",
    medium_novel: "小说",
  },
  en: {
    app_title: "X-Critical",
    app_subtitle: "The Extreme Screener System",
    search_placeholder: "Enter Title (e.g., Steins;Gate)",
    select_medium: "Medium",
    analyze_btn: "ANALYZE",
    analyze_note: "Strict Protocol: Local First // Model: Gemini 3 Pro",
    loading_trivia: "ANALYSIS COMPLETE",
    loading_status: "SYSTEM READY // MODULE B.8 SYNCHRONIZED",
    loading_analysis: "ANALYZING...",
    loading_connect: "LOADING... // CONNECTING TO NEURAL NETWORK",
    view_result: "VIEW RESULTS",
    verdict_in: "ACCEPTED (IN)",
    verdict_out: "REJECTED (OUT)",
    basis: "BASIS",
    mode_local: "MODE: LOCAL",
    mode_hybrid: "MODE: HYBRID",
    metrics_scan: "METRICS SCAN",
    metrics_e: "E (Logos)",
    metrics_a: "A (Pathos)",
    metrics_c: "C (Techne)",
    metrics_o: "O (Originality)",
    metrics_u: "U (Unity)",
    metrics_r: "R (Resonance)",
    pk_module: "CROSS-COMPARE (PK)",
    pk_diff: "DIFF",
    source_weighting: "SOURCE WEIGHTING",
    local_model: "LOCAL MODEL",
    abbf_calib: "ABBF CALIBRATION",
    consensus: "CONSENSUS",
    bandwagon: "BANDWAGON",
    taboo_tax: "TABOO TAX",
    strategy: "STRATEGY",
    risks: "RISKS & FLAWS",
    advice: "ADVISORY",
    version: "BEST VERSION",
    mood: "ATMOSPHERE",
    prereq: "PREREQUISITES",
    recos: "RELATED ARCHIVES",
    recos_alt: "ALTERNATIVES",
    recos_ext: "EXTENSIONS",
    sources: "SOURCES",
    raw_json: "RAW JSON",
    hybrid_btn: "RUN ABBF WEB CALIBRATION ->",
    manifesto_title: "ALGORITHM MANIFESTO",
    manifesto_close: "CLOSE",
    studio: "STUDIO/AUTHOR",
    key_staff: "KEY STAFF",
    trivia: "TRIVIA",
    medium_anime: "Anime",
    medium_manga: "Manga",
    medium_vn: "Visual Novel",
    medium_novel: "Novel",
  },
  ja: {
    app_title: "極限選別",
    app_subtitle: "X-Critical: AI深度メディア審査システム",
    search_placeholder: "タイトルを入力 (例: Steins;Gate)",
    select_medium: "媒体",
    analyze_btn: "分析開始",
    analyze_note: "Strict Protocol: Local First // Model: Gemini 3 Pro",
    loading_trivia: "審査完了",
    loading_status: "SYSTEM READY // MODULE B.8 SYNCHRONIZED",
    loading_analysis: "詳細審査中...",
    loading_connect: "LOADING... // CONNECTING TO NEURAL NETWORK",
    view_result: "結果を表示",
    verdict_in: "推奨 (IN)",
    verdict_out: "選外 (OUT)",
    basis: "根拠",
    mode_local: "モード: ローカル",
    mode_hybrid: "モード: ハイブリッド",
    metrics_scan: "次元スキャン (Metrics)",
    metrics_e: "E (理性)",
    metrics_a: "A (感情)",
    metrics_c: "C (技巧)",
    metrics_o: "O (独創)",
    metrics_u: "U (調和)",
    metrics_r: "R (残響)",
    pk_module: "比較対決 (PK)",
    pk_diff: "差分",
    source_weighting: "ソース比重 (Weighting)",
    local_model: "ローカル認知モデル",
    abbf_calib: "ABBF アルゴリズム補正",
    consensus: "合意信頼度",
    bandwagon: "同調圧力",
    taboo_tax: "タブー税",
    strategy: "アルゴリズム決定",
    risks: "リスク・欠陥",
    advice: "鑑賞アドバイス",
    version: "推奨版",
    mood: "推奨環境",
    prereq: "前提条件",
    recos: "関連アーカイブ",
    recos_alt: "上位互換推奨",
    recos_ext: "同系統推奨",
    sources: "情報源",
    raw_json: "生JSON",
    hybrid_btn: "ABBF ネットワーク補正を実行 ->",
    manifesto_title: "アルゴリズム白書",
    manifesto_close: "閉じる",
    studio: "制作/著者",
    key_staff: "主要スタッフ",
    trivia: "制作秘話",
    medium_anime: "アニメ",
    medium_manga: "マンガ",
    medium_vn: "ビジュアルノベル",
    medium_novel: "小説",
  }
};

export const MANIFESTO_CONTENT = {
  zh: {
    title: "X-Critical 协议白皮书 v3.1",
    sections: [
      {
        header: "1. 核心哲学 (Philosophy)",
        body: "X-Critical 的存在是为了对抗‘评分通胀’与‘平庸的温水’。我们认为，真正的神作必须在理性（Logos）或感性（Pathos）上达到极致，而非仅仅是‘没有短板的水桶机’。系统宁可错杀一部良作，绝不放过一部平庸之作。"
      },
      {
        header: "2. 六维评分体系 (Dimensions)",
        body: "• E (理性): 逻辑自洽性与哲学深度。\n• A (情感): 角色弧光与情绪爆发力。\n• C (工艺): 叙事技巧、演出与媒介协同。\n• O (原创): 概念首创性或旧瓶新酒的突破。\n• U (一致): 结局闭合度与全程质量稳定性。\n• R (残响): 作品结束后的戒断反应与长尾效应。"
      },
      {
        header: "3. ABBF 算法 (The ABBF Engine)",
        body: "Adaptive Bayesian-Bandwagon Filtering (自适应贝叶斯-跟风过滤) 是本系统的核心风控模块。它用于解决‘叫好不叫座’或‘跟风黑’的问题。\n\n• 共识置信度 (Consensus Reliability): 若网络评分两极分化（1分与10分互刷），系统将大幅降低网络权重 ($\\\\omega < 0.3$)，回归本地AI判断。\n• 题材税 (Taboo Tax): 若作品涉及伦理/暴力等敏感题材导致网络低分，而AI分析其内核深刻，系统将启动‘抗压模式’，强制忽略网络上的道德审判。"
      },
      {
        header: "4. 混合架构 (Hybrid Architecture)",
        body: "• 阶段一 (Local): 使用 Gemini 3 Pro 的内建知识库进行纯净评审，不受外界舆论干扰。\n• 阶段二 (Hybrid): 联网检索实时数据，通过 ABBF 算法计算融合系数 ($\\\\omega$)，生成最终的修正分数。"
      }
    ]
  },
  en: {
    title: "X-Critical Protocol Manifesto v3.1",
    sections: [
      {
        header: "1. Philosophy",
        body: "X-Critical exists to combat 'score inflation' and 'mediocrity'. We believe a masterpiece must achieve extremity in either Logos (Reason) or Pathos (Emotion), rather than being a 'jack-of-all-trades'. The system prioritizes strict filtering over inclusivity."
      },
      {
        header: "2. The 6-Dimensional Metric",
        body: "• E (Logos): Logical consistency and philosophical depth.\n• A (Pathos): Character arcs and emotional impact.\n• C (Techne): Narrative craft and technical execution.\n• O (Originality): Novelty and boundary-pushing concepts.\n• U (Unity): Pacing consistency and narrative closure.\n• R (Resonance): Post-completion impact and re-watch value."
      },
      {
        header: "3. The ABBF Engine",
        body: "Adaptive Bayesian-Bandwagon Filtering is our risk control module. It handles 'review bombing' and 'controversial masterpieces'.\n\n• Consensus Reliability: If online reviews are polarizing (1s vs 10s), the system distrusts the web ($\\\\omega < 0.3$) and relies on local AI.\n• Taboo Tax: If a work is downvoted due to sensitive themes (taboo, violence) but possesses high artistic merit, the system activates 'Resilience Mode', ignoring moralistic review bombing."
      },
      {
        header: "4. Hybrid Architecture",
        body: "• Stage 1 (Local): Pure analysis using Gemini 3 Pro's internal knowledge, isolated from public opinion.\n• Stage 2 (Hybrid): Real-time web calibration. The system calculates a blending coefficient ($\\\\omega$) via ABBF to produce the final score."
      }
    ]
  },
  ja: {
    title: "X-Critical プロトコル白書 v3.1",
    sections: [
      {
        header: "1. 核心哲学 (Philosophy)",
        body: "X-Criticalは「スコアのインフレ」と「凡庸な作品」に対抗するために存在します。真の傑作とは、理性（Logos）または感性（Pathos）において極限に達しているべきであり、単に「欠点がないだけの優等生」ではありません。"
      },
      {
        header: "2. 六次元評価システム (Dimensions)",
        body: "• E (理性): 論理的整合性と哲学的深度。\n• A (感情): キャラクターの魅力と感情的爆発力。\n• C (技巧): 演出技術と媒体の特性活用。\n• O (独創): 概念の新規性とジャンル破壊。\n• U (調和): 構成の安定性と結末の完結度。\n• R (残響): 読了後の余韻と長期的影響。"
      },
      {
        header: "3. ABBF アルゴリズム (The ABBF Engine)",
        body: "Adaptive Bayesian-Bandwagon Filtering（適応型ベイズ・バンドワゴンフィルタリング）は、本システムの核心です。\n\n• 合意信頼度: ネット上の評価が二極化（1点と10点の応酬）している場合、システムはネット情報を軽視し($\\\\omega < 0.3$)、AIのローカル判断を優先します。\n• タブー税: 過激なテーマ（倫理、暴力）によりネット評価が不当に低い場合、システムは「耐性モード」を発動し、道徳的批判による減点を無効化します。"
      },
      {
        header: "4. ハイブリッド構造",
        body: "• フェーズ1 (Local): Gemini 3 Proの内部知識のみを使用した純粋な審査。\n• フェーズ2 (Hybrid): リアルタイム検索による補正。ABBFを用いて融合係数($\\\\omega$)を計算し、最終スコアを算出します。"
      }
    ]
  }
}
