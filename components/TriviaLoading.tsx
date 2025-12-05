
import React from 'react';
import { TriviaData, Language } from '../types';
import { Loader2, Clapperboard, Users, Sparkles, ArrowRight } from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

interface Props {
  data: TriviaData | null;
  isReady: boolean;
  onViewResult: () => void;
  lang: Language;
}

const TriviaLoading: React.FC<Props> = ({ data, isReady, onViewResult, lang }) => {
  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4 animate-fade-in-up">
      
      {/* Loading Status Indicator */}
      <div className="mb-8 flex items-center gap-3">
         <div className={`p-3 rounded-full ${isReady ? 'bg-gold text-obsidian' : 'bg-zinc-800 text-gold animate-pulse'}`}>
            {isReady ? <Sparkles size={24} /> : <Loader2 size={24} className="animate-spin" />}
         </div>
         <div>
             <h2 className="text-xl font-bold text-zinc-200">
                {isReady ? t.loading_trivia : t.loading_analysis}
             </h2>
             <p className="text-xs font-mono text-zinc-500">
                {isReady ? t.loading_status : t.loading_connect}
             </p>
         </div>
      </div>

      {/* Trivia Card */}
      <div className="w-full bg-charcoal border border-zinc-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl"></div>

        {!data ? (
          // Skeleton Loader
          <div className="space-y-4 animate-pulse">
             <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
             <div className="h-12 bg-zinc-800 rounded w-full"></div>
             <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
          </div>
        ) : (
          // Actual Content
          <div className="space-y-6 animate-fade-in-up">
             <div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                    <Clapperboard size={14} /> {t.studio}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl text-zinc-200 font-bold">{data.studio}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                        data.studio_status.includes('Active') || data.studio_status === 'Active' 
                        ? 'border-green-900 text-green-500 bg-green-900/10' 
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                        {data.studio_status}
                    </span>
                </div>
             </div>

             <div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                    <Users size={14} /> {t.key_staff}
                </div>
                <div className="text-zinc-300 text-sm">{data.key_staff}</div>
             </div>

             <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800/50">
                 <div className="flex items-center gap-2 text-xs font-bold text-gold-dim uppercase tracking-widest mb-2">
                    <Sparkles size={14} /> {t.trivia}
                </div>
                <p className="text-zinc-400 text-sm italic">
                    "{data.production_trivia}"
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className={`mt-8 transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
         <button 
            onClick={onViewResult}
            className="group bg-gold hover:bg-yellow-500 text-obsidian font-bold text-lg px-8 py-4 rounded-lg shadow-lg shadow-gold/10 flex items-center gap-2 transition-all"
         >
            {t.view_result}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
      
    </div>
  );
};

export default TriviaLoading;
