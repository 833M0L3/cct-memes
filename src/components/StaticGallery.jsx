import React, { useState, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MEME_FILES } from "../memesList";
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

  const filteredFiles = MEME_FILES.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeLightbox = () => setSelectedFile(null);

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedFile) return;
    setSlideDirection('right');
    const currentIndex = filteredFiles.indexOf(selectedFile);
    const nextIndex = (currentIndex + 1) % filteredFiles.length;
    setSelectedFile(filteredFiles[nextIndex]);
  }, [selectedFile, filteredFiles]);

  const showPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedFile) return;
    setSlideDirection('left');
    const currentIndex = filteredFiles.indexOf(selectedFile);
    const prevIndex = (currentIndex - 1 + filteredFiles.length) % filteredFiles.length;
    setSelectedFile(filteredFiles[prevIndex]);
  }, [selectedFile, filteredFiles]);

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
      <header className={"sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-transparent transition-shadow duration-300 " + (isDark ? 'bg-[#181a1b]' : 'bg-white') }>
        <div className="flex items-center gap-4">
          <button 
            className="p-3 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
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
            <span className="text-[20px] sm:text-[22px] text-[#5f6368] dark:text-[#e3e3e3] tracking-[-0.5px] font-medium" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
              CCT Memories
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-[720px] mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-[#5f6368]" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search your photos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f1f3f4] text-[#3c4043] rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:bg-white focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] transition-all placeholder-[#5f6368]"
          />
        </div>

        {/* Profile Icon */}
        <div className="flex items-center gap-2">
          {/* Dark/Light Mode Toggle */}
          <button
            className={"p-2 rounded-full transition-colors focus:outline-none " + (isDark ? 'bg-[#23272b] text-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
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
          {/* GitHub Repo Icon (circle) */}
          <a
            href="https://github.com/bimal1412/cct-memes"
            target="_blank"
            rel="noopener noreferrer"
            className={"p-2 rounded-full transition-colors ml-1 flex items-center justify-center " + (isDark ? 'bg-[#23272b] hover:bg-[#30363d] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}
            title="View GitHub Repo"
            style={{ width: 36, height: 36 }}
          >
            <Github size={20} />
          </a>
          {/* Profile Icon */}
          <a
            href="https://github.com/bimal1412"
            target="_blank"
            rel="noopener noreferrer"
            className={"p-1 rounded-full transition-colors ml-2 " + (isDark ? 'hover:bg-[#23272b]' : 'hover:bg-gray-100')}
            title="Go to GitHub Profile"
          >
            <img 
              src="https://avatars.githubusercontent.com/u/59522309?v=4" 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm"
            />
          </a>
        </div>
      </header>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-[80%] bg-white h-full shadow-2xl flex flex-col py-6 animate-slide-left z-10">
            <div className="px-6 pb-6 mb-2">
              <span className="text-[22px] font-medium text-[#5f6368]" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>CCT Memories</span>
            </div>
            
            <div 
              className={`flex items-center gap-5 px-6 py-3 cursor-pointer rounded-r-full mr-4 transition-colors ${activeTab === 'photos' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-[#3c4043] hover:bg-[#f1f3f4]'}`}
              onClick={() => { setActiveTab('photos'); setIsSidebarOpen(false); }}
            >
              <ImageIcon size={22} className={activeTab === 'photos' ? 'text-[#1a73e8]' : 'text-[#5f6368]'} />
              <span className={`text-[14px] ${activeTab === 'photos' ? 'font-medium' : 'font-normal'}`}>Photos</span>
            </div>
            
            <div 
              className={`flex items-center gap-5 px-6 py-3 cursor-pointer rounded-r-full mr-4 transition-colors ${activeTab === 'about' ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-[#3c4043] hover:bg-[#f1f3f4]'}`}
              onClick={() => { setActiveTab('about'); setIsSidebarOpen(false); }}
            >
              <Info size={22} className={activeTab === 'about' ? 'text-[#1a73e8]' : 'text-[#5f6368]'} />
              <span className={`text-[14px] ${activeTab === 'about' ? 'font-medium' : 'font-normal'}`}>About</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-20 relative" id="scroll-container">
          {activeTab === 'photos' ? (
            <>
              {/* Group Header */}
              <div className={
                `sticky top-0 backdrop-blur-sm z-10 pt-4 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 flex items-center justify-between ` +
                (isDark ? 'bg-[#23272b]/95' : 'bg-white/95')
              }>
                <h2 className={"text-[15px] font-medium " + (isDark ? 'text-[#e3e3e3]' : 'text-[#3c4043]')}>CCT Batch 2021</h2>
                <div className={"text-[13px] " + (isDark ? 'text-[#b0b0b0]' : 'text-[#5f6368]')}>
                   {filteredFiles.length} items
                </div>
              </div>

              {/* Grid Layout (Dense, square aspect ratios) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1 mt-1">
                {filteredFiles.map((file, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-[#f1f3f4] overflow-hidden cursor-pointer"
                    style={{ aspectRatio: "1 / 1" }}
                    onClick={() => setSelectedFile(file)}
                  >
                    {isVideo(file) ? (
                      <>
                        <video
                          src={`${import.meta.env.BASE_URL}memes/${encodeURIComponent(file)}`}
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
                      <img
                        src={`${import.meta.env.BASE_URL}memes/${encodeURIComponent(file)}`}
                        alt={file}
                        className="w-full h-full object-cover"
                        loading="lazy"
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

              {filteredFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-[#5f6368]">
                  <Search size={48} className="mb-4 text-[#dadce0]" />
                  <p>No photos found</p>
                </div>
              )}
            </>
          ) : (
            <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
              <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="bg-[#f8f9fa] border-b border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                    <svg viewBox="0 0 40 40" className="w-20 h-20 drop-shadow-sm">
                      <path d="M20,20 L20,0 C9,0 0,9 0,20 Z" fill="#EA4335" />
                      <path d="M20,20 L40,20 C40,9 31,0 20,0 Z" fill="#4285F4" />
                      <path d="M20,20 L20,40 C31,40 40,31 40,20 Z" fill="#34A853" />
                      <path d="M20,20 L0,20 C0,31 9,40 20,40 Z" fill="#FBBC05" />
                    </svg>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-medium text-center text-[#1a73e8]" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
                    About CCT Memories
                  </h1>
                </div>
                
                <div className="p-8 sm:p-12 text-[#3c4043] space-y-6 text-base sm:text-lg leading-relaxed">
                  <p>
                    This is the webpage made to preserve memories of Bimal Dhital during his time attending CCT college BSc CSIT course.
                  </p>
                  <p>
                    Throughout the years from 2021 onwards, Bimal and the entire Batch of 2021 have shared countless moments of joy, late-night coding sessions, exam struggles, and unforgettable latenight discord call sessions. This gallery serves as a nostalgic archive, a time capsule of those chaotic but beautiful college days at Central Campus of Technology.
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
              {filteredFiles.indexOf(selectedFile) + 1} / {filteredFiles.length}
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
                  src={`${import.meta.env.BASE_URL}memes/${encodeURIComponent(selectedFile)}`}
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
                      src={`${import.meta.env.BASE_URL}memes/${encodeURIComponent(selectedFile)}`}
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
