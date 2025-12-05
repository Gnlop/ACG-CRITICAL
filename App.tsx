
import React, { useState } from 'react';
import { analyzeLocalWork, analyzeHybridWork, getQuickTrivia, constructHybridPrompt } from './services/geminiService';
import ReviewResultDisplay from './components/ReviewResultDisplay';
import TriviaLoading from './components/TriviaLoading';
import { ReviewResult, Medium, TriviaData, Language } from './types';
import { Search, Loader2, Terminal, BookOpen, X, Globe2 } from 'lucide-react';
import { UI_TRANSLATIONS, MANIFESTO_CONTENT } from './constants';

type ViewState = 'search' | 'loading' | 'result' | 'loading_hybrid';

const ManifestoModal: React.FC<{ lang: Language; onClose: () => void }> = ({ lang, onClose }) => {
  const content = MANIFESTO_CONTENT[lang];
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-bold text-gold flex items-center gap-2">
                <BookOpen size={20} />
                {content.title}
            </h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
            {content.sections.map((section, idx) => (
                <div key={idx}>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">{section.header}</h3>
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                        {section.body}
                    </p>
                </div>
            ))}
        </div>
        <div className="p-4 border-t border-zinc-800 text-right">
            <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-zinc-300">
                {UI_TRANSLATIONS[lang].manifesto_close}
            </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState<Medium>('Anime');
  const [notes, setNotes] = useState('');
  const [lang, setLang] = useState<Language>('zh');
  const [showManifesto, setShowManifesto] = useState(false);
  
  const [view, setView] = useState<ViewState>('search');
  const [error, setError] = useState<string | null>(null);
  
  // Analysis Data
  const [result, setResult] = useState<ReviewResult | null>(null);
  
  // Trivia Data
  const [trivia, setTrivia] = useState<TriviaData | null>(null);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  
  // Debug/Transparency Data
  const [hybridPrompt, setHybridPrompt] = useState<string>('');

  const t = UI_TRANSLATIONS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Reset state
    setView('loading');
    setError(null);
    setResult(null);
    setTrivia(null);
    setIsAnalysisReady(false);

    // Parallel Execution
    // 1. Fetch Trivia (Fast, non-blocking)
    getQuickTrivia(title, medium, lang).then(data => {
        setTrivia(data);
    });

    // 2. Fetch Local Analysis (Stage 1)
    try {
      const data = await analyzeLocalWork(title, medium, notes, lang);
      setResult(data);
      setIsAnalysisReady(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setView('search'); // Go back on error
    }
  };

  const handleProceedToHybrid = async () => {
    if (!result) return;
    
    // Generate prompt for display transparency
    const prompt = constructHybridPrompt(title, medium, result, lang);
    setHybridPrompt(prompt);
    
    setView('loading_hybrid');
    setError(null);

    try {
        const hybridData = await analyzeHybridWork(title, medium, result, lang);
        setResult(hybridData);
        setView('result'); // Re-render result view with new data
    } catch (err: any) {
        setError("Network Analysis Failed: " + err.message);
        setView('result'); // Stay on result view but show error
    }
  };

  const handleViewResult = () => {
    if (result) {
        setView('result');
    }
  };

  const handleReset = () => {
      setTitle('');
      setNotes('');
      setView('search');
      setResult(null);
      setTrivia(null);
      setHybridPrompt('');
  };

  return (
    <div className="min-h-screen bg-obsidian text-zinc-200 selection:bg-gold selection:text-black">
      
      {showManifesto && <ManifestoModal lang={lang} onClose={() => setShowManifesto(false)} />}

      {/* Navbar / Brand */}
      <nav className="border-b border-zinc-900 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
             <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center text-obsidian font-black">
                X
             </div>
             <span className="font-bold tracking-tight text-lg hidden sm:block">CRITICAL</span>
          </div>
          
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowManifesto(true)}
                className="text-xs font-mono text-zinc-500 hover:text-gold flex items-center gap-1 transition-colors"
              >
                 <BookOpen size={14} />
                 <span className="hidden sm:inline">{t.manifesto_title}</span>
              </button>

              <div className="h-4 w-px bg-zinc-800" />
              
              <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${lang === 'zh' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    CN
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLang('ja')}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${lang === 'ja' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    JP
                  </button>
              </div>
          </div>
        </div>
      </nav>

      <main className="pb-20">
        
        {/* VIEW: SEARCH */}
        {view === 'search' && (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in-up">
                <div className="text-center mb-10 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                        {t.app_title}
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        {t.app_subtitle}
                    </p>
                    <button 
                        onClick={() => setShowManifesto(true)}
                        className="mt-4 text-xs text-gold/70 hover:text-gold border-b border-gold/30 hover:border-gold pb-0.5 transition-all"
                    >
                        {t.manifesto_title} &rarr;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
                    <div className="bg-charcoal p-1.5 rounded-xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row gap-2">
                        <select 
                            value={medium}
                            onChange={(e) => setMedium(e.target.value as Medium)}
                            className="bg-transparent text-zinc-300 font-mono text-sm px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-zinc-800 focus:outline-none"
                        >
                            <option value="Anime">{t.medium_anime}</option>
                            <option value="Manga">{t.medium_manga}</option>
                            <option value="VN">{t.medium_vn}</option>
                            <option value="Novel">{t.medium_novel}</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder={t.search_placeholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none"
                            autoFocus
                        />
                        <button 
                            type="submit" 
                            className="bg-gold hover:bg-yellow-500 text-obsidian font-bold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Advanced Toggle (Visual only for now, keeps UI clean) */}
                    <div className="pt-2">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes to guide AI..."
                            className="w-full bg-transparent text-sm text-zinc-400 border border-zinc-800 rounded-lg p-3 h-24 focus:border-zinc-600 focus:outline-none transition-colors resize-none"
                        />
                         <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-xs text-zinc-600">{t.analyze_note}</span>
                         </div>
                    </div>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg max-w-xl text-sm text-center">
                        Error: {error}
                    </div>
                )}
            </div>
        )}

        {/* VIEW: LOADING (TRIVIA) */}
        {view === 'loading' && (
             <TriviaLoading 
                data={trivia} 
                isReady={isAnalysisReady} 
                onViewResult={handleViewResult} 
                lang={lang}
             />
        )}

        {/* VIEW: LOADING HYBRID */}
        {view === 'loading_hybrid' && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-3xl flex flex-col items-center">
                    <div className="text-center mb-6 animate-pulse">
                        <Loader2 size={48} className="animate-spin text-gold mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">{t.loading_analysis}</h2>
                        <p className="text-zinc-400 font-mono text-sm">SEARCHING GOOGLE... CALCULATING OMEGA WEIGHTS...</p>
                    </div>
                    
                    <div className="w-full bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[60vh]">
                        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                            <Terminal size={14} className="text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-400">active_session.prompt_stream</span>
                        </div>
                        <div className="p-4 overflow-y-auto font-mono text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
                            {hybridPrompt || "Initializing prompt stream..."}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: RESULT (LOCAL OR HYBRID) */}
        {view === 'result' && result && (
            <div className="pt-10">
                 <div className="max-w-5xl mx-auto px-4 mb-6 flex justify-between items-center">
                    <button 
                        onClick={handleReset}
                        className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
                    >
                        ← Back
                    </button>
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                 </div>
                 
                 <ReviewResultDisplay 
                    result={result} 
                    onHybridAnalyze={handleProceedToHybrid} 
                    lang={lang}
                />
            </div>
        )}
      </main>

      <footer className="py-8 border-t border-zinc-900 text-center text-zinc-700 text-xs font-mono">
        <p>X-CRITICAL PROTOCOL // CALC MODULE B.8 // GEMINI 3 PRO</p>
      </footer>
    </div>
  );
};

export default App;
