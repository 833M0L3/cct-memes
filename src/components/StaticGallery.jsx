import React, { useState, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MEME_FILES } from "../memesList";
import { SCREENSHOT_FILES } from "../screenshotsList";
import { 
  Menu, Search, CheckCircle2, PlayCircle,
  ChevronLeft, ChevronRight, X, Image as ImageIcon, Info, Github
} from "lucide-react";

// Dark mode hook
function useDarkMode() {
  // Default to light mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return [isDark, setIsDark];
}

// Helper to determine if a filename is a video
const isVideo = (filename) => /\.mp4$/i.test(filename);


export default function StaticGallery() {
  const [isDark, setIsDark] = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');


  // Album selection: 'photos' or 'screenshots'
  const albumFiles = activeTab === 'photos'
    ? MEME_FILES.filter(file => file.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeTab === 'screenshots'
      ? SCREENSHOT_FILES.filter(file => file.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  const closeLightbox = () => setSelectedFile(null);

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedFile) return;
    setSlideDirection('right');
    const currentIndex = albumFiles.indexOf(selectedFile);
    const nextIndex = (currentIndex + 1) % albumFiles.length;
    setSelectedFile(albumFiles[nextIndex]);
  }, [selectedFile, albumFiles]);

  const showPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedFile) return;
    setSlideDirection('left');
    const currentIndex = albumFiles.indexOf(selectedFile);
    const prevIndex = (currentIndex - 1 + albumFiles.length) % albumFiles.length;
    setSelectedFile(albumFiles[prevIndex]);
  }, [selectedFile, albumFiles]);

  const onTouchStart = (e) => {
    if (e.touches.length > 1) {
      setTouchStart(null);
      return;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (e.touches.length > 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || zoomScale > 1.05) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    
    setTouchStart(null);
    setTouchEnd(null);

    if (isLeftSwipe) {
      showNext();
    } else if (isRightSwipe) {
      showPrev();
    }
  };

  // Handle keyboard navigation in Lightbox
  useEffect(() => {
    if (!selectedFile) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFile, showNext, showPrev]);

  return (
    <div className={"min-h-screen font-sans transition-colors duration-300 " + (isDark ? 'bg-[#181a1b] text-[#e3e3e3]' : 'bg-white text-[#3c4043]') }>
      {/* Header */}
      <header className={"sticky top-0 z-50 flex items-center justify-between px-2 sm:px-4 py-2 border-b transition-shadow duration-300 " + (isDark ? 'bg-[#181a1b] border-[#2a2d2e] shadow-[0_1px_3px_rgba(0,0,0,0.4)]' : 'bg-white border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.15)]') }>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Hamburger — mobile only */}
          <button 
            className={"md:hidden p-2 sm:p-3 rounded-full transition-colors " + (isDark ? 'hover:bg-[#2a2d2e] text-[#e3e3e3]' : 'hover:bg-[#f1f3f4] text-[#5f6368]')}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer pr-4"
            onClick={() => setActiveTab('photos')}
            title="Go to Home"
          >
            {/* Google Photos Icon Mock */}
            <div className="relative flex items-center justify-center" style={{ width: '2.2rem', height: '2.2rem', minWidth: '1.8rem', minHeight: '1.8rem', maxWidth: '2.5rem', maxHeight: '2.5rem' }}>
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M20,20 L20,0 C9,0 0,9 0,20 Z" fill="#EA4335" />
                <path d="M20,20 L40,20 C40,9 31,0 20,0 Z" fill="#4285F4" />
                <path d="M20,20 L20,40 C31,40 40,31 40,20 Z" fill="#34A853" />
                <path d="M20,20 L0,20 C0,31 9,40 20,40 Z" fill="#FBBC05" />
              </svg>
            </div>
            <span className={"text-[16px] sm:text-[20px] tracking-[-0.5px] font-medium " + (isDark ? 'text-[#e3e3e3]' : 'text-[#5f6368]')} style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
              CCT Memories
            </span>
          </div>
        </div>

        {/* Search Bar — desktop only */}
        <div className="hidden md:flex flex-1 max-w-[640px] mx-4 lg:mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-[#5f6368]" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search your photos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={"w-full rounded-full py-2 pl-11 pr-4 text-sm focus:outline-none transition-all " + (isDark ? 'bg-[#2a2d2e] text-[#e3e3e3] placeholder-[#9aa0a6] focus:bg-[#35373a]' : 'bg-[#f1f3f4] text-[#3c4043] placeholder-[#5f6368] focus:bg-white focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)]')}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Dark/Light Mode Toggle */}
          <button
            className={"p-2 rounded-full transition-colors focus:outline-none " + (isDark ? 'text-yellow-300 hover:bg-[#2a2d2e]' : 'text-[#5f6368] hover:bg-[#f1f3f4]')}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
            )}
          </button>
          {/* GitHub */}
          <a
            href="https://github.com/833M0L3/cct-memes"
            target="_blank"
            rel="noopener noreferrer"
            className={"p-2 rounded-full transition-colors flex items-center justify-center " + (isDark ? 'text-[#e3e3e3] hover:bg-[#2a2d2e]' : 'text-[#5f6368] hover:bg-[#f1f3f4]')}
            title="View GitHub Repo"
          >
            <Github size={20} />
          </a>
          {/* Profile avatar */}
          <a
            href="https://github.com/833M0L3"
            target="_blank"
            rel="noopener noreferrer"
            className="p-0.5 rounded-full ml-1"
            title="Go to GitHub Profile"
          >
            <img 
              src="https://avatars.githubusercontent.com/u/59522309?v=4" 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-[#dadce0] object-cover"
            />
          </a>
        </div>
      </header>

      {/* Mobile search bar — shown below header on small screens */}
      {(activeTab === 'photos' || activeTab === 'screenshots') && (
        <div className={"md:hidden px-3 py-2 border-b " + (isDark ? 'bg-[#181a1b] border-[#2a2d2e]' : 'bg-white border-[#e8eaed]')}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-[#5f6368]" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={"w-full rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none transition-all " + (isDark ? 'bg-[#2a2d2e] text-[#e3e3e3] placeholder-[#9aa0a6]' : 'bg-[#f1f3f4] text-[#3c4043] placeholder-[#5f6368]')}
            />
          </div>
        </div>
      )}

      {/* ── Permanent sidebar (desktop only, always visible) ─────────── */}
      <aside className={"hidden md:flex fixed inset-y-0 left-0 z-40 flex-col w-64 border-r " + (isDark ? 'bg-[#181a1b] border-[#2a2d2e]' : 'bg-white border-[#e8eaed]')}>
        {/* Sidebar header — same height as main header so they align */}
        <div className={"flex items-center gap-2 px-4 h-[57px] border-b flex-shrink-0 " + (isDark ? 'border-[#2a2d2e]' : 'border-[#e8eaed]')}>
          <svg viewBox="0 0 40 40" style={{width:'1.8rem',height:'1.8rem',flexShrink:0}}>
            <path d="M20,20 L20,0 C9,0 0,9 0,20 Z" fill="#EA4335" />
            <path d="M20,20 L40,20 C40,9 31,0 20,0 Z" fill="#4285F4" />
            <path d="M20,20 L20,40 C31,40 40,31 40,20 Z" fill="#34A853" />
            <path d="M20,20 L0,20 C0,31 9,40 20,40 Z" fill="#FBBC05" />
          </svg>
          <span className={"text-[18px] font-medium tracking-[-0.3px] " + (isDark ? 'text-[#e3e3e3]' : 'text-[#5f6368]')} style={{fontFamily:"'Product Sans',Arial,sans-serif"}}>CCT Memories</span>
        </div>
        {/* Nav items */}
        <div className="flex flex-col gap-0.5 flex-1 pt-2 overflow-y-auto">
          {[
            { id: 'photos', label: 'Memes' },
            { id: 'screenshots', label: 'Screenshot Memories' },
          ].map(({ id, label }) => (
            <div
              key={id}
              className={`flex items-center gap-4 pl-6 pr-4 py-3 mr-3 cursor-pointer rounded-r-full transition-colors ${
                activeTab === id
                  ? (isDark ? 'bg-[#394457] text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]')
                  : (isDark ? 'text-[#e3e3e3] hover:bg-[#2a2d2e]' : 'text-[#3c4043] hover:bg-[#f1f3f4]')
              }`}
              onClick={() => setActiveTab(id)}
            >
              <ImageIcon size={20} className={activeTab === id ? (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]') : (isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]')} />
              <span className={`text-[14px] ${activeTab === id ? 'font-medium' : 'font-normal'}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="pb-6 pr-3">
          <div
            className={`flex items-center gap-4 pl-6 py-3 cursor-pointer rounded-r-full transition-colors ${
              activeTab === 'about'
                ? (isDark ? 'bg-[#394457] text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]')
                : (isDark ? 'text-[#e3e3e3] hover:bg-[#2a2d2e]' : 'text-[#3c4043] hover:bg-[#f1f3f4]')
            }`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={20} className={activeTab === 'about' ? (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]') : (isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]')} />
            <span className={`text-[14px] ${activeTab === 'about' ? 'font-medium' : 'font-normal'}`}>About</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile drawer sidebar (overlay, only on small screens) ─────── */}
      {/* Overlay — only shown when open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-[199] bg-black/30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Drawer — always in DOM, slides in/out via transform */}
      <aside
        className={"md:hidden fixed inset-y-0 left-0 z-[200] flex flex-col shadow-2xl h-full w-72 sm:w-80 transition-transform duration-300 ease-in-out " +
          (isDark ? 'bg-[#202124]' : 'bg-white') + " " +
          (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
        }>
            {/* Close button for sidebar */}
            <button
              className={"absolute top-3 right-3 p-2 rounded-full transition-colors " + (isDark ? 'hover:bg-[#2a2d2e] text-[#9aa0a6]' : 'hover:bg-[#f1f3f4] text-[#5f6368]')}
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
            <div className="px-6 pt-10 pb-4 mb-1 flex flex-col gap-1">
              <span className={"text-[22px] font-medium " + (isDark ? 'text-[#e3e3e3]' : 'text-[#5f6368]')} style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>CCT Memories</span>
              <span className={"text-[12px] " + (isDark ? 'text-[#9aa0a6]' : 'text-[#80868b]')}>{MEME_FILES.length + SCREENSHOT_FILES.length} total items</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              {[
                { id: 'photos', label: 'Memes' },
                { id: 'screenshots', label: 'Screenshot Memories' },
              ].map(({ id, label }) => (
                <div
                  key={id}
                  className={`flex items-center gap-4 pl-6 pr-4 py-3 mr-3 cursor-pointer rounded-r-full transition-colors ${
                    activeTab === id
                      ? (isDark ? 'bg-[#394457] text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]')
                      : (isDark ? 'text-[#e3e3e3] hover:bg-[#2a2d2e]' : 'text-[#3c4043] hover:bg-[#f1f3f4]')
                  }`}
                  onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
                >
                  <ImageIcon size={20} className={activeTab === id ? (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]') : (isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]')} />
                  <span className={`text-[14px] ${activeTab === id ? 'font-medium' : 'font-normal'}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pb-6 pr-3">
              <div 
                className={`flex items-center gap-4 pl-6 py-3 cursor-pointer rounded-r-full transition-colors ${
                  activeTab === 'about'
                    ? (isDark ? 'bg-[#394457] text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]')
                    : (isDark ? 'text-[#e3e3e3] hover:bg-[#2a2d2e]' : 'text-[#3c4043] hover:bg-[#f1f3f4]')
                }`}
                onClick={() => { setActiveTab('about'); setIsSidebarOpen(false); }}
              >
                <Info size={20} className={activeTab === 'about' ? (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]') : (isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]')} />
                <span className={`text-[14px] ${activeTab === 'about' ? 'font-medium' : 'font-normal'}`}>About</span>
              </div>
            </div>
      </aside>

      {/* Content area — offset on desktop to sit beside the permanent sidebar */}
      <div className="md:ml-64 flex min-h-[calc(100vh-56px)] overflow-hidden">
        <main className="flex-1 overflow-y-auto px-1 sm:px-3 lg:px-5 xl:px-8 pb-20 sm:pb-8" id="scroll-container">
          {activeTab === 'photos' || activeTab === 'screenshots' ? (
            <>
              {/* Group Header (tight, no extra space) */}
              <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 xl:px-8 mt-2 mb-2">
                <h2 className={"text-[15px] font-medium " + (isDark ? 'text-[#e3e3e3]' : 'text-[#3c4043]')}>{activeTab === 'photos' ? 'CCT Memes' : 'Screenshot Memories'}</h2>
                <div className={"text-[13px] " + (isDark ? 'text-[#b0b0b0]' : 'text-[#5f6368]')}>
                   {albumFiles.length} items
                </div>
              </div>

              {/* Grid Layout (Dense, square aspect ratios) */}
              <div key={activeTab} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-1 mt-2">
                {albumFiles.map((file) => (
                  <div 
                    key={file} 
                    className="group relative bg-[#f1f3f4] overflow-hidden cursor-pointer"
                    style={{ aspectRatio: "1 / 1" }}
                    onClick={() => setSelectedFile(file)}
                  >
                    {isVideo(file) ? (
                      <>
                        <video
                          src={`${import.meta.env.BASE_URL}${activeTab === 'photos' ? 'memes' : 'ss'}/${encodeURIComponent(file)}`}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseOver={e => e.target.play()}
                          onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                        <div className="absolute top-2 right-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                          <PlayCircle size={20} fill="currentColor" stroke="white" strokeWidth={1} />
                        </div>
                      </>
                    ) : (
                      <LazyImage
                        src={`${import.meta.env.BASE_URL}${activeTab === 'photos' ? 'memes' : 'ss'}/${encodeURIComponent(file)}`}
                        alt={file}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {/* Select Checkbox icon */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/30 hover:bg-white rounded-full p-0.5 border-2 border-white text-transparent hover:text-[#1a73e8] transition-colors shadow-sm">
                        <CheckCircle2 size={16} strokeWidth={3} className="text-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {albumFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-[#5f6368]">
                  <Search size={48} className="mb-4 text-[#dadce0]" />
                  <p>No photos found</p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full">
              {/* About Header Bar (matches gallery) */}
              <div className={
                `sticky top-0 backdrop-blur-sm z-10 pt-4 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 flex items-center justify-between ` +
                (isDark ? 'bg-[#23272b]/95' : 'bg-white/95')
              }>
                <h2 className={"text-[15px] font-medium " + (isDark ? 'text-[#e3e3e3]' : 'text-[#3c4043]')}>About CCT Memories</h2>
                <div className={"text-[13px] " + (isDark ? 'text-[#b0b0b0]' : 'text-[#5f6368]')}>
                  v1.0.0
                </div>
              </div>
              {/* About Content (matches gallery padding/colors) */}
              <div className={
                `w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 ` +
                (isDark ? 'text-[#e3e3e3]' : 'text-[#3c4043]')
              }>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                    <svg viewBox="0 0 40 40" className="w-16 h-16 drop-shadow-sm">
                      <path d="M20,20 L20,0 C9,0 0,9 0,20 Z" fill="#EA4335" />
                      <path d="M20,20 L40,20 C40,9 31,0 20,0 Z" fill="#4285F4" />
                      <path d="M20,20 L20,40 C31,40 40,31 40,20 Z" fill="#34A853" />
                      <path d="M20,20 L0,20 C0,31 9,40 20,40 Z" fill="#FBBC05" />
                    </svg>
                  </div>
                  <h1 className={"text-2xl sm:text-3xl font-medium text-center " + (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]')} style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
                    CCT Memories
                  </h1>
                </div>
                <div className="space-y-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                  <p>
                    This is the webpage made to preserve memories of Bimal during his bachelor's undergraduate days attending computer science in CCT college.
                  </p>
                  <p>
                    Throughout the years from 2021 onwards, Bimal and the entire Batch of 2021 have shared countless moments of joy, late-night coding sessions, exam struggles, and unforgettable late-night discord call sessions. This gallery serves as a nostalgic archive, a time capsule of those chaotic but beautiful college days.
                  </p>
                  <p>
                    From surviving rigorous lab assignments to the spontaneous inside jokes shared among friends, every meme and photo here holds a story. Feel free to browse, laugh, and reminisce about the good old days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      {selectedFile && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
          onTouchStartCapture={onTouchStart}
          onTouchMoveCapture={onTouchMove}
          onTouchEndCapture={onTouchEnd}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
            <span className="text-white/80 font-medium text-sm drop-shadow-md">
              {albumFiles.indexOf(selectedFile) + 1} / {albumFiles.length}
            </span>
            <button 
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Prev */}
          <button 
            className="absolute left-4 p-3 rounded-full text-white hover:bg-white/10 transition-colors hidden sm:block z-10"
            onClick={showPrev}
          >
            <ChevronLeft size={36} />
          </button>

          {/* Media Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div 
              key={selectedFile} 
              className={`w-full h-full flex items-center justify-center pointer-events-auto ${slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
              onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
            >
              {isVideo(selectedFile) ? (
                <video
                  src={`${import.meta.env.BASE_URL}${activeTab === 'screenshots' ? 'ss' : 'memes'}/${encodeURIComponent(selectedFile)}`}
                  controls
                  autoPlay
                  className="w-full h-full max-h-screen object-contain"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <TransformWrapper
                  key={selectedFile}
                  initialScale={1}
                  minScale={1}
                  maxScale={5}
                  centerOnInit
                  wheel={{ smoothStep: 0.005 }}
                  panning={{ disabled: zoomScale <= 1.05 }}
                  onTransformed={(ref) => setZoomScale(ref.state.scale)}
                >
                  <TransformComponent 
                    wrapperClass="!w-full !h-full" 
                    contentClass="!w-full !h-full flex items-center justify-center"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${activeTab === 'screenshots' ? 'ss' : 'memes'}/${encodeURIComponent(selectedFile)}`}
                      alt={selectedFile}
                      className="w-full h-full max-w-full max-h-[100dvh] object-contain pointer-events-none"
                    />
                  </TransformComponent>
                </TransformWrapper>
              )}
            </div>
          </div>

          {/* Navigation Next */}
          <button 
            className="absolute right-4 p-3 rounded-full text-white hover:bg-white/10 transition-colors hidden sm:block z-10"
            onClick={showNext}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}

// LazyImage component with shimmer skeleton + fade-in on load
function LazyImage({ src, alt, className }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    let observer;
    if (imgRef.current && !isVisible) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(imgRef.current);
    }
    return () => observer && observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {/* Shimmer skeleton shown until image fully loads */}
      {!isLoaded && (
        <div className="skeleton absolute inset-0" />
      )}
      <img
        src={isVisible ? src : undefined}
        alt={alt}
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
