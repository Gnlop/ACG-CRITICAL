
import React, { useState } from 'react';
import { ReviewResult, Scores, Language } from '../types';
import RadarChart from './RadarChart';
import { UI_TRANSLATIONS } from '../constants';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Layers, 
  Thermometer,
  Swords,
  ChevronDown,
  ChevronUp,
  Code,
  Globe,
  BrainCircuit,
  Network,
  Zap,
  Scale,
  ShieldAlert,
  Users
} from 'lucide-react';

interface Props {
  result: ReviewResult;
  onHybridAnalyze: () => void;
  lang: Language;
}

const translateMedium = (m: string, t: any) => {
  const map: Record<string, string> = {
    'Anime': t.medium_anime,
    'Manga': t.medium_manga,
    'VN': t.medium_vn,
    'Novel': t.medium_novel
  };
  return map[m] || m;
};

const ScoreBadge: React.FC<{ label: string; score: number; verdict: string }> = ({ label, score, verdict }) => {
    const isHigh = score >= 4.5;
    const isMid = score >= 4.0;
    
    let colorClass = "text-zinc-500";
    if (verdict === 'IN') {
        if (isHigh) colorClass = "text-gold";
        else if (isMid) colorClass = "text-zinc-300";
    } else {
        if (isHigh) colorClass = "text-zinc-300";
    }

    return (
        <div className="flex flex-col items-center p-2 border border-zinc-800 bg-charcoal rounded-md">
            <span className="text-xs text-zinc-500 font-mono mb-1">{label}</span>
            <span className={`text-xl font-bold font-mono ${colorClass}`}>{score.toFixed(1)}</span>
        </div>
    )
}

const ReviewResultDisplay: React.FC<Props> = ({ result, onHybridAnalyze, lang }) => {
  const t = UI_TRANSLATIONS[lang];
  const [showJson, setShowJson] = useState(false);
  const isIn = result.verdict === 'IN';
  
  // Check if this is a local-only result
  // If scores_online is missing or empty, it's local
  const isLocalMode = !result.scores_online;
  
  const borderColor = isIn ? 'border-gold' : 'border-zinc-700';
  const titleColor = isIn ? 'text-gold' : 'text-zinc-400';

  // Source Analysis Data
  const omega = result.source_analysis?.blending_coefficient ?? 0.0;
  const localPct = ((1 - omega) * 100).toFixed(0);
  const onlinePct = (omega * 100).toFixed(0);
  
  // New ABBF Metrics
  const consensusReliability = result.source_analysis?.consensus_reliability || 'Unknown';
  const isBandwagon = result.source_analysis?.bandwagon_penalty_detected || false;
  const moralFactor = result.source_analysis?.moral_controversy_factor || 0;

  // PK Logic Check
  const hasPkData = result.pk && result.pk.comparators && result.pk.comparators.length > 0;
  const sAfter = Number(result.pk?.S_after) || 0;
  const sBefore = Number(result.pk?.S_before) || 0;
  const diff = sAfter - sBefore;

  return (
    <div className={`w-full max-w-5xl mx-auto p-1 md:p-6 animate-fade-in pb-24`}>
      
      {/* Header / Verdict Banner */}
      <div className={`relative overflow-hidden rounded-xl border-2 ${borderColor} bg-obsidian mb-6 shadow-2xl transition-all duration-500`}>
        {isIn && (
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <CheckCircle2 size={120} className="text-gold" />
           </div>
        )}
        {!isIn && (
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <XCircle size={120} className="text-zinc-500" />
           </div>
        )}
        
        <div className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded text-xs font-bold tracking-widest ${isIn ? 'bg-gold text-black' : 'bg-zinc-700 text-zinc-300'}`}>
                  {isIn ? t.verdict_in : t.verdict_out}
                </span>
                {result.verdict_basis && (
                   <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded font-mono">
                     {t.basis}: TYPE-{result.verdict_basis}
                   </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded font-mono border ${isLocalMode ? 'border-sky-800 text-sky-400' : 'border-emerald-800 text-emerald-400'}`}>
                  {isLocalMode ? t.mode_local : t.mode_hybrid}
                </span>
              </div>
              <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${titleColor} mb-2`}>
                {lang === 'zh' ? (result.title_localized?.zh || result.title_localized?.en) : 
                 lang === 'ja' ? (result.title_localized?.ja || result.title_localized?.en) :
                 (result.title_localized?.en || result.title_localized?.zh)}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-500 font-mono">
                {lang !== 'ja' && result.title_localized?.ja && <span>{result.title_localized.ja}</span>}
                {lang !== 'en' && result.title_localized?.en && <span>{result.title_localized.en}</span>}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Score (S_adj)</div>
                <div className={`text-4xl md:text-5xl font-mono font-bold ${isIn ? 'text-white' : 'text-zinc-500'}`}>
                    {result.indices?.S_adj?.toFixed(2) || "N/A"}
                </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-zinc-300 italic border-l-4 border-zinc-700 pl-4 py-1 mb-6">
            "{result.one_line_reason || 'Analysis complete.'}"
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.highlights?.map((h, i) => (
                <div key={i} className="bg-charcoal/50 p-3 rounded border border-zinc-800">
                    <span className="text-xs text-gold-dim uppercase font-bold block mb-1">[{h.tag}]</span>
                    <span className="text-sm text-zinc-300">{h.point}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Quantitative (Scores, PK) (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
            
            {/* 1. Scores Grid */}
            <div className="bg-charcoal rounded-xl border border-zinc-800 p-5">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Thermometer size={16} /> {t.metrics_scan}
                </h3>
                {result.scores && (
                    <>
                        <RadarChart 
                            scores={result.scores} 
                            scoresLocal={result.scores_local}
                            scoresOnline={result.scores_online}
                            verdict={result.verdict} 
                            lang={lang}
                        />
                        
                        {/* Score Badges */}
                        <div className="grid grid-cols-6 gap-2 mt-4">
                            <ScoreBadge label="E" score={result.scores.E} verdict={result.verdict} />
                            <ScoreBadge label="A" score={result.scores.A} verdict={result.verdict} />
                            <ScoreBadge label="C" score={result.scores.C} verdict={result.verdict} />
                            <ScoreBadge label="O" score={result.scores.O} verdict={result.verdict} />
                            <ScoreBadge label="U" score={result.scores.U} verdict={result.verdict} />
                            <ScoreBadge label="R" score={result.scores.R} verdict={result.verdict} />
                        </div>

                         {/* Comparison Table */}
                        <div className="mt-5 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 text-xs font-mono">
                          <div className="grid grid-cols-4 bg-zinc-900/80 p-2 text-zinc-500 font-bold border-b border-zinc-800">
                            <div>DIM</div>
                            <div className="text-center text-sky-500">LOC</div>
                            <div className="text-center text-emerald-500">NET</div>
                            <div className="text-center text-gold">FIN</div>
                          </div>
                          {['E', 'A', 'C', 'O', 'U', 'R'].map((k) => {
                             const key = k as keyof Scores;
                             return (
                              <div key={k} className="grid grid-cols-4 p-1.5 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                                <div className="font-bold text-zinc-400 pl-1">{k}</div>
                                <div className="text-center text-sky-400/80">{result.scores_local?.[key]?.toFixed(1) ?? '-'}</div>
                                <div className="text-center text-emerald-400/80">{result.scores_online?.[key]?.toFixed(1) ?? '-'}</div>
                                <div className="text-center text-gold font-bold">{result.scores[key].toFixed(1)}</div>
                              </div>
                            );
                          })}
                        </div>
                    </>
                )}
            </div>

            {/* 2. PK Section (Remains Left) */}
            {hasPkData && (
                <div className="bg-charcoal rounded-xl border border-zinc-800 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Swords size={16} /> {t.pk_module}
                        </h3>
                        <div className="text-xs font-mono text-zinc-600">
                            {t.pk_diff}: <span className={diff >= 0 ? 'text-green-500' : 'text-danger'}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {result.pk.comparators.map((comp, i) => (
                            <div key={i} className="bg-obsidian/50 p-3 rounded border border-zinc-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-zinc-300 truncate max-w-[150px]">{comp.title}</span>
                                    <span className="text-xs font-mono text-zinc-500">W: {comp.weight?.toFixed(2)}</span>
                                </div>
                                
                                {/* Comparison Bar */}
                                <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1">
                                    <div 
                                        className={`absolute top-0 bottom-0 left-1/2 w-0.5 bg-zinc-600 z-10`} 
                                    />
                                    <div 
                                        className={`absolute top-0 bottom-0 transition-all duration-500 ${comp.adv_component > 0 ? 'left-1/2 bg-gold' : 'right-1/2 bg-zinc-500'}`}
                                        style={{ 
                                            width: `${Math.min(Math.abs((comp.adv_component || 0) * 200), 50)}%`, 
                                            left: comp.adv_component > 0 ? '50%' : 'auto',
                                            right: comp.adv_component <= 0 ? '50%' : 'auto'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Qualitative (Source, Risks, Recos) (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
            
            {/* 1. Source Analysis (Weighting) */}
            {result.source_analysis && (
              <div className={`rounded-xl border p-5 transition-all ${isLocalMode ? 'bg-sky-900/10 border-sky-800' : 'bg-charcoal border-zinc-800'}`}>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isLocalMode ? 'text-sky-400' : 'text-zinc-500'}`}>
                      <Scale size={16} /> {isLocalMode ? t.local_model : t.abbf_calib}
                  </h3>
                  
                  {/* Weight Bar */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                    <span className="flex items-center gap-1 text-sky-400"><BrainCircuit size={12}/> {t.mode_local} ({localPct}%)</span>
                    <span className="text-zinc-600">Ω = {omega.toFixed(2)}</span>
                    <span className="flex items-center gap-1 text-emerald-400"><Network size={12}/> {t.mode_hybrid} ({onlinePct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex mb-4">
                    <div className="h-full bg-sky-900/50" style={{ width: `${localPct}%` }}></div>
                    <div className="h-full bg-emerald-900/50" style={{ width: `${onlinePct}%` }}></div>
                  </div>

                  {/* ABBF Indicators */}
                  {!isLocalMode && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                           <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 text-center">
                                <div className="text-[10px] text-zinc-500 uppercase mb-1">{t.consensus}</div>
                                <div className={`text-xs font-bold ${
                                    consensusReliability === 'Low' ? 'text-red-400' : 
                                    consensusReliability === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                    {consensusReliability}
                                </div>
                           </div>
                           <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 text-center">
                                <div className="text-[10px] text-zinc-500 uppercase mb-1">{t.bandwagon}</div>
                                <div className={`text-xs font-bold ${isBandwagon ? 'text-gold' : 'text-zinc-600'}`}>
                                    {isBandwagon ? 'ACTIVE' : 'INACTIVE'}
                                </div>
                           </div>
                            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 text-center">
                                <div className="text-[10px] text-zinc-500 uppercase mb-1">{t.taboo_tax}</div>
                                <div className={`text-xs font-bold ${moralFactor > 0.5 ? 'text-red-400' : 'text-zinc-400'}`}>
                                    {(moralFactor * 100).toFixed(0)}%
                                </div>
                           </div>
                      </div>
                  )}

                  <div className="bg-zinc-900/50 p-3 rounded text-xs text-zinc-400 border border-zinc-800 flex items-start gap-2">
                     <Info size={14} className="mt-0.5 text-zinc-500 shrink-0"/>
                     <div>
                        <span className="text-zinc-500 font-bold block mb-1">{t.strategy}:</span>
                        {result.source_analysis.conflict_notes || "Local analysis pending online verification."}
                     </div>
                  </div>
              </div>
            )}
            
             {/* 2. Risks & Media Advice */}
             <div className="bg-charcoal rounded-xl border border-zinc-800 p-5 space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldAlert size={16} /> {t.risks}
                    </h3>
                    <ul className="space-y-2">
                        {result.risks && result.risks.length > 0 ? result.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-danger/80 flex items-start gap-2">
                                <span className="mt-1.5 block w-1 h-1 bg-danger rounded-full flex-shrink-0"></span>
                                <span className="leading-relaxed">{risk}</span>
                            </li>
                        )) : <li className="text-sm text-zinc-600 italic">No significant risks detected.</li>}
                    </ul>
                </div>
                
                {result.media_advice && (
                    <div className="border-t border-zinc-800 pt-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users size={16} /> {t.advice}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-zinc-600 text-xs">{t.version}</span>
                                <span className="text-zinc-300">{result.media_advice.version}</span>
                            </div>
                            <div>
                                <span className="block text-zinc-600 text-xs">{t.mood}</span>
                                <span className="text-zinc-300">{result.media_advice.season_mood}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-zinc-600 text-xs">{t.prereq}</span>
                                <span className="text-zinc-300">{result.media_advice.prereq}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Similar Recommendations */}
            <div className="bg-charcoal rounded-xl border border-zinc-800 p-5">
                 <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers size={16} /> {isIn ? t.recos_ext : t.recos_alt}
                </h3>
                <div className="space-y-3">
                    {result.similar_recos?.map((rec, i) => (
                        <div key={i} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors">
                            <div className="flex-1 mr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-zinc-200">{rec.title}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded border border-zinc-700/50">{translateMedium(rec.medium, t)}</span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">{rec.reason}</p>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 mt-2 sm:mt-0 font-mono text-xs min-w-[60px]">
                                <div className="text-right">
                                    <span className="text-zinc-600 mr-2 sm:mr-0">SIM</span>
                                    <span className="text-zinc-400">{(rec.similarity * 100).toFixed(0)}%</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-zinc-600 mr-2 sm:mr-0">PRI</span>
                                    <span className={`text-zinc-400 ${i === 0 ? 'text-gold' : ''}`}>{(rec.priority * 100).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
      
        {/* Sources / Grounding */}
        {result.grounding_urls && result.grounding_urls.length > 0 && (
            <div className="mt-8 border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Globe size={16} /> {t.sources}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {result.grounding_urls.map((url, i) => (
                        <a key={i} href={url.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-gold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded truncate max-w-[200px] md:max-w-xs transition-colors flex items-center gap-1">
                            {url.title}
                        </a>
                    ))}
                </div>
            </div>
        )}

        {/* JSON Toggle */}
        <div className="mt-8 border-t border-zinc-800 pt-6">
            <button 
                onClick={() => setShowJson(!showJson)}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                <Code size={14} />
                {showJson ? 'HIDE RAW JSON' : t.raw_json}
                {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {showJson && (
                <pre className="mt-4 p-4 bg-black rounded border border-zinc-800 text-xs font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>

        {/* HYBRID TRIGGER (Floating Button if Local Mode) */}
        {isLocalMode && (
             <div className="fixed bottom-6 right-6 z-50">
                 <button 
                    onClick={onHybridAnalyze}
                    className="group bg-gold hover:bg-white text-obsidian font-bold text-sm px-6 py-4 rounded-xl shadow-2xl shadow-gold/20 flex items-center gap-3 transition-all animate-bounce hover:animate-none border border-black/10"
                 >
                    <div className="bg-black/10 p-2 rounded-full">
                        <Zap size={20} className="fill-current" />
                    </div>
                    <div className="text-left">
                        <div className="leading-none text-[10px] opacity-70 mb-0.5">LOCAL ANALYSIS DONE</div>
                        <div className="leading-none text-base">{t.hybrid_btn}</div>
                    </div>
                 </button>
             </div>
        )}

    </div>
  );
};

export default ReviewResultDisplay;
