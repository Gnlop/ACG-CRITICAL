import React, { useState } from 'react';
import { ReviewResult, Scores, Language } from '../types';
import RadarChart from './RadarChart';
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
  Cpu,
  Target
} from 'lucide-react';

interface Props {
  result: ReviewResult;
  lang: Language;
}

const translateMedium = (m: string) => {
  const map: Record<string, string> = {
    'Anime': '动画',
    'Manga': '漫画',
    'VN': '视觉小说',
    'Novel': '小说'
  };
  return map[m] || m;
};

const ReviewResultDisplay: React.FC<Props> = ({ result, lang }) => {
  const [showJson, setShowJson] = useState(false);
  const isIn = result.verdict === 'IN';
  
  // Theme Colors
  const accentColor = isIn ? 'text-gold' : 'text-zinc-500';
  const accentBg = isIn ? 'bg-gold' : 'bg-zinc-600';
  const panelBorder = 'border-zinc-800';
  const panelBg = 'bg-zinc-950';

  // Calculations
  const omega = result.source_analysis?.blending_coefficient ?? 0.5;
  const localPct = ((1 - omega) * 100).toFixed(0);
  const onlinePct = (omega * 100).toFixed(0);

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-6 animate-fade-in text-zinc-300 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className={`relative overflow-hidden rounded-lg border-2 ${isIn ? 'border-gold/50' : 'border-zinc-800'} bg-black shadow-2xl mb-6`}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 opacity-10 ${isIn ? 'bg-gradient-to-r from-gold via-black to-black' : 'bg-zinc-900'}`} />
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded text-xs font-black tracking-widest ${accentBg} text-black`}>
                        {result.verdict}
                    </span>
                    <span className="text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded font-mono uppercase">
                        Basis: {result.verdict_basis || 'AUTO'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase flex items-center gap-1">
                         <Cpu size={10} /> v3.1 PRO
                    </span>
                </div>
                <h1 className={`text-3xl md:text-5xl font-black tracking-tight text-white mb-2 leading-tight`}>
                    {result.title_localized?.zh || "Unknown Title"}
                </h1>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-500">
                    <span>{result.title_localized?.en}</span>
                    <span>/</span>
                    <span>{result.title_localized?.ja}</span>
                </div>
            </div>

            <div className="text-right bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 backdrop-blur-sm min-w-[140px]">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total Score (S_adj)</div>
                <div className={`text-4xl font-mono font-bold ${isIn ? 'text-white' : 'text-zinc-500'}`}>
                    {result.indices?.S_adj?.toFixed(2) ?? "0.00"}
                </div>
            </div>
        </div>
      </div>


      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- LEFT COLUMN: DATA CORE --- */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* 1. Radar Chart Panel */}
            <div className={`rounded-lg border ${panelBorder} ${panelBg} overflow-hidden`}>
                <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Thermometer size={14} /> 维度扫描 (Metrics)
                    </h3>
                </div>
                <div className="p-4">
                    {result.scores && (
                        <RadarChart 
                            scores={result.scores} 
                            scoresLocal={result.scores_local} 
                            scoresOnline={result.scores_online} 
                            verdict={result.verdict} 
                            lang={lang}
                        />
                    )}
                </div>
                
                {/* Score Matrix Table */}
                <div className="border-t border-zinc-800 text-[10px] font-mono">
                    <div className="grid grid-cols-4 bg-zinc-900/50 p-2 text-zinc-600 font-bold">
                        <div>DIM</div>
                        <div className="text-center text-sky-500">LOC</div>
                        <div className="text-center text-emerald-500">NET</div>
                        <div className="text-center text-gold">FIN</div>
                    </div>
                    {['E', 'A', 'C', 'O', 'U', 'R'].map((k) => {
                        const key = k as keyof Scores;
                        return (
                        <div key={k} className="grid grid-cols-4 p-2 border-t border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                            <div className="font-bold text-zinc-400 pl-1">{k}</div>
                            <div className="text-center text-sky-400/80">{result.scores_local?.[key]?.toFixed(1) ?? '-'}</div>
                            <div className="text-center text-emerald-400/80">{result.scores_online?.[key]?.toFixed(1) ?? '-'}</div>
                            <div className="text-center text-white font-bold">{result.scores[key].toFixed(1)}</div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Source Weighting Panel */}
            {result.source_analysis && (
                <div className={`rounded-lg border ${panelBorder} ${panelBg} p-4`}>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BrainCircuit size={14} /> 混合源博弈 (Weighting)
                    </h3>
                    
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2">
                        <span className="text-sky-400">LOCAL (AI)</span>
                        <span>Ω = {omega.toFixed(2)}</span>
                        <span className="text-emerald-400">ONLINE (WEB)</span>
                    </div>

                    <div className="h-1.5 w-full bg-zinc-800 rounded-full flex overflow-hidden mb-4">
                        <div className="h-full bg-sky-500" style={{ width: `${localPct}%` }} />
                        <div className="h-full bg-emerald-500" style={{ width: `${onlinePct}%` }} />
                    </div>

                    <div className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 p-3 rounded leading-relaxed">
                        <span className="text-zinc-600 font-bold mr-1">ANALYSIS:</span>
                        {result.source_analysis.conflict_notes}
                    </div>
                </div>
            )}
            
            {/* 3. PK Module (Compact) */}
            {result.pk?.comparators?.length > 0 && (
                <div className={`rounded-lg border ${panelBorder} ${panelBg} p-4`}>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Swords size={14} /> 二次比对 (PK)
                    </h3>
                    <div className="space-y-3">
                        {result.pk.comparators.map((comp, i) => (
                             <div key={i} className="text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-300 truncate w-32">{comp.title}</span>
                                    <span className="font-mono text-zinc-500">{(comp.weight * 100).toFixed(0)}%</span>
                                </div>
                                <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="absolute left-1/2 bottom-0 top-0 w-px bg-zinc-600 z-10" />
                                    <div 
                                        className={`absolute top-0 bottom-0 ${comp.adv_component > 0 ? 'bg-gold left-1/2' : 'bg-zinc-500 right-1/2'}`}
                                        style={{ width: `${Math.min(Math.abs(comp.adv_component * 200), 50)}%` }}
                                    />
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

        </div>

        {/* --- RIGHT COLUMN: INTEL LOG --- */}
        <div className="lg:col-span-2 space-y-6">

             {/* 1. The Verdict Reason */}
             <div className={`rounded-lg border ${panelBorder} ${panelBg} p-6`}>
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target size={14} /> 核心判词 (Verdict)
                </h3>
                <p className={`text-lg md:text-xl italic font-serif leading-relaxed ${isIn ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    "{result.one_line_reason}"
                </p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                    {result.highlights?.map((h, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-xs flex items-center gap-2">
                            <span className="text-gold font-bold uppercase tracking-wider text-[10px]">{h.tag}</span>
                            <span className="text-zinc-400">{h.point}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* 2. Risks & Advice Split */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Risks */}
                <div className={`rounded-lg border ${panelBorder} ${panelBg} p-5 h-full`}>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertTriangle size={14} /> 风险 (Risks)
                    </h3>
                    <ul className="space-y-3">
                        {result.risks?.length ? result.risks.map((r, i) => (
                            <li key={i} className="flex gap-3 text-xs text-zinc-400 leading-relaxed">
                                <span className="text-danger mt-0.5">•</span>
                                {r}
                            </li>
                        )) : <span className="text-xs text-zinc-600 italic">No significant risks detected.</span>}
                    </ul>
                </div>

                {/* Advice */}
                <div className={`rounded-lg border ${panelBorder} ${panelBg} p-5 h-full`}>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} /> 建议 (Advice)
                    </h3>
                    {result.media_advice && (
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] text-zinc-600 uppercase mb-1">Version</div>
                                <div className="text-sm text-zinc-300">{result.media_advice.version}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-600 uppercase mb-1">Prerequisite</div>
                                <div className="text-sm text-zinc-300">{result.media_advice.prereq}</div>
                            </div>
                             <div>
                                <div className="text-[10px] text-zinc-600 uppercase mb-1">Atmosphere</div>
                                <div className="text-sm text-zinc-300">{result.media_advice.season_mood}</div>
                            </div>
                        </div>
                    )}
                </div>
             </div>

             {/* 3. Recommendations & Sources */}
             <div className={`rounded-lg border ${panelBorder} ${panelBg} p-5`}>
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers size={14} /> 关联档案 (Related)
                </h3>
                <div className="space-y-3 mb-6">
                     {result.similar_recos?.map((rec, i) => (
                        <div key={i} className="flex justify-between items-center p-2 hover:bg-zinc-900 rounded transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold group-hover:text-white ${i===0 ? 'text-gold' : 'text-zinc-500'}`}>0{i+1}</span>
                                <div>
                                    <div className="text-sm text-zinc-300 font-bold flex items-center gap-2">
                                        {rec.title}
                                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded font-normal">{translateMedium(rec.medium)}</span>
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{rec.reason}</div>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-xs text-zinc-400 font-mono">{(rec.similarity * 100).toFixed(0)}% Match</span>
                            </div>
                        </div>
                     ))}
                </div>
                
                {/* Sources Footer */}
                {result.grounding_urls && result.grounding_urls.length > 0 && (
                    <div className="border-t border-zinc-800 pt-4 mt-4">
                        <div className="flex flex-wrap gap-2">
                            {result.grounding_urls.map((url, i) => (
                                <a key={i} href={url.uri} target="_blank" className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400 hover:text-gold hover:border-gold/30 transition-colors max-w-[200px] truncate">
                                    <Globe size={10} />
                                    <span className="truncate">{url.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
             </div>
             
              {/* JSON Toggle */}
              <div className="pt-2 text-right">
                <button 
                    onClick={() => setShowJson(!showJson)}
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    <Code size={10} />
                    <span>RAW JSON</span>
                    {showJson ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </button>
                {showJson && (
                    <pre className="mt-2 p-4 bg-black border border-zinc-800 rounded text-[10px] text-zinc-500 font-mono text-left overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}
             </div>

        </div>

      </div>
    </div>
  );
};

export default ReviewResultDisplay;