
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Attraction, AppStatus } from './types';
import { fetchAttractions } from './services/attractionService';
import AttractionCard from './components/AttractionCard';
import SkeletonCard from './components/SkeletonCard';

const App: React.FC = () => {
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // 前端關鍵字過濾
  const displayAttractions = useMemo(() => {
    if (!keyword.trim()) return allAttractions;
    const lowerKeyword = keyword.toLowerCase();
    return allAttractions.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword) ||
      (item.introduction && item.introduction.toLowerCase().includes(lowerKeyword))
    );
  }, [allAttractions, keyword]);

  // 載入資料
  const loadData = useCallback(async (pageNum: number, isNew: boolean = false) => {
    setStatus(AppStatus.LOADING);
    if (isNew) {
      setAllAttractions([]);
      setPage(1);
      setHasMore(true);
    }

    try {
      const result = await fetchAttractions('zh-tw', pageNum);
      const newData = result.data || [];
      
      if (newData.length === 0) {
        setHasMore(false);
        if (isNew) setStatus(AppStatus.EMPTY);
        else setStatus(AppStatus.SUCCESS);
      } else {
        setAllAttractions(prev => isNew ? newData : [...prev, ...newData]);
        // API 通常每頁回傳 30 筆，若少於 30 則視為最後一頁
        setHasMore(newData.length >= 30);
        setStatus(AppStatus.SUCCESS);
      }
      setErrorMsg('');
    } catch (error: any) {
      console.error('App loadData Error:', error.message);
      setErrorMsg(error.message);
      setStatus(AppStatus.ERROR);
    }
  }, []);

  // 初次載入
  useEffect(() => {
    loadData(1, true);
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(inputRef.current?.value || '');
  };

  const handleLoadMore = () => {
    if (status === AppStatus.LOADING || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, false);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.location.assign(window.location.href)}
          >
            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tighter uppercase leading-none">Taipei</span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase leading-normal">Attractions</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <button className="text-black border-b-2 border-black pb-1">探索景點</button>
            <button className="hover:text-black transition-colors">最新活動</button>
            <button className="hover:text-black transition-colors">交通導引</button>
          </nav>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-6xl md:text-8xl mb-8 italic font-light tracking-tight text-slate-900">
            Taipei <span className="text-gray-300">Unveiled.</span>
          </h1>
          <p className="text-gray-400 text-[11px] tracking-[0.5em] uppercase font-bold mb-12">
            探索台北．尋找城市的靈魂
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <input 
              ref={inputRef}
              type="text" 
              placeholder="輸入景點名稱或關鍵字..."
              className="w-full bg-gray-50 border border-transparent py-6 px-8 text-lg focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none rounded-none placeholder:text-gray-300"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95"
            >
              搜尋景點
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-6 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-gray-100 pb-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            {status === AppStatus.LOADING ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
                正在同步 API 數據...
              </span>
            ) : `當前顯示 ${displayAttractions.length} 個精彩景點`}
          </div>
          {keyword && (
            <button 
              onClick={() => { if(inputRef.current) inputRef.current.value = ''; setKeyword(''); }}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black underline underline-offset-8"
            >
              重設搜尋 ✕
            </button>
          )}
        </div>

        {/* Error Feedback */}
        {status === AppStatus.ERROR && (
          <div className="text-center py-20 bg-red-50/30 border border-red-100 rounded-lg mb-12">
            <div className="text-4xl mb-4">⊙</div>
            <h3 className="text-xl font-bold mb-2">無法讀取景點資料</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed px-4">
              {errorMsg}<br/>
              建議檢查網路連線，或嘗試點擊下方按鈕重新載入。
            </p>
            <button 
              onClick={() => loadData(1, true)}
              className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              重新整理
            </button>
          </div>
        )}

        {/* Empty Result */}
        {status === AppStatus.EMPTY || (status === AppStatus.SUCCESS && displayAttractions.length === 0) ? (
          <div className="text-center py-40">
            <h3 className="text-3xl font-serif italic text-gray-300 mb-4">No attractions found.</h3>
            <p className="text-gray-400 text-xs uppercase tracking-widest">請嘗試其他關鍵字或稍後再試</p>
          </div>
        ) : null}

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {displayAttractions.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${(idx % 4) * 0.1}s` }}
            >
              <AttractionCard attraction={item} />
            </div>
          ))}
          
          {/* Skeleton Loaders */}
          {status === AppStatus.LOADING && (
            <>
              {[...Array(4)].map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </>
          )}
        </div>

        {/* Load More Button */}
        {status === AppStatus.SUCCESS && hasMore && !keyword && (
          <div className="mt-32 text-center">
            <button 
              onClick={handleLoadMore}
              disabled={status === AppStatus.LOADING}
              className="group relative inline-flex items-center gap-8 px-16 py-7 border border-black text-black text-[10px] font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-black hover:text-white disabled:opacity-30"
            >
              <span className="relative z-10">探索更多景點</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-20 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black flex items-center justify-center rotate-45">
                <span className="text-white font-bold text-xs -rotate-45">T</span>
              </div>
              <span className="font-bold tracking-tighter uppercase text-sm">Taipei Explorer</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-loose uppercase tracking-widest">
              本平台致力於推廣台北城市美學與文化觀光。景點資訊同步自台北市政府觀光傳播局 Open API。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <div className="flex flex-col gap-5">
              <span className="text-black mb-1">關於台北</span>
              <a href="#" className="hover:text-black transition-colors">景點分類</a>
              <a href="#" className="hover:text-black transition-colors">行程規劃</a>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-black mb-1">服務中心</span>
              <a href="#" className="hover:text-black transition-colors">API 說明</a>
              <a href="#" className="hover:text-black transition-colors">聯絡我們</a>
            </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-gray-100 text-[9px] font-bold text-gray-300 uppercase tracking-[0.5em]">
          <span>© 2024 Taipei Travel Explorer.</span>
          <span>Designed for City Lovers.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
