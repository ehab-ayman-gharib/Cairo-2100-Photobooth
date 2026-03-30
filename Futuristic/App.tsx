import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Download, Share2, Sparkles, MapPin, Info, ArrowRight, Loader2, Key } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from './lib/utils';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const LANDMARKS = [
  { 
    id: 'tahrir', 
    name: 'Tahrir Square', 
    nameAr: 'ميدان التحرير',
    description: 'The heart of Cairo featuring the historic AUC Palace and the iconic red Egyptian Museum, reimagined with holographic displays.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-neon-lights-42475-large.mp4',
    overlay: 'AR_TAHRIR_GRID'
  },
  { 
    id: 'nile', 
    name: 'The Nile & Qasr al-Nil', 
    nameAr: 'النيل وقصر النيل',
    description: 'The iconic Qasr al-Nil Bridge with its famous bronze lions and futuristic feluccas with solar sails on a glowing Nile.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-rain-42476-large.mp4',
    overlay: 'AR_NILE_FLOW'
  },
  { 
    id: 'downtown', 
    name: 'Downtown & Statues', 
    nameAr: 'وسط البلد والتماثيل',
    description: 'Cyberpunk streets featuring the Talaat Harb statue and the Nahdet Misr monument, enhanced with digital energy.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-at-night-42477-large.mp4',
    overlay: 'AR_DOWNTOWN_HOLO'
  },
  { 
    id: 'tower', 
    name: 'Cairo Tower', 
    nameAr: 'برج القاهرة',
    description: 'The iconic lotus tower, now a beacon of clean energy overlooking a high-tech Cairo skyline.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-futuristic-city-42474-large.mp4',
    overlay: 'AR_TOWER_BEACON'
  },
];

const PROPS = [
  { id: 'drone', name: 'Pet Drone', nameAr: 'طائرة مرافقة', category: 'Companion', icon: '🛸', prompt: 'with a small personal flying drone hovering near their shoulder' },
  { id: 'energy', name: 'Ankh Core', nameAr: 'قلب الحياة', category: 'Handheld', icon: '⚡', prompt: 'holding a glowing blue energy core shaped like an ancient Ankh' },
  { id: 'aura', name: 'Neural Aura', nameAr: 'هالة عصبية', category: 'Atmosphere', icon: '✨', prompt: 'surrounded by a subtle glowing pink and blue neural energy aura' },
  { id: 'wings', name: 'Digital Wings', nameAr: 'أجنحة رقمية', category: 'Back', icon: '🦋', prompt: 'with ethereal holographic digital wings made of light behind them' },
  { id: 'orbs', name: 'Floating Orbs', nameAr: 'كرات طافية', category: 'Atmosphere', icon: '🔮', prompt: 'with several small glowing holographic data orbs floating around them' },
];

const WARDROBE_STYLES = [
  "sleek tech-wear with glowing fiber-optic patterns",
  "flowing neo-traditional Egyptian robes with metallic accents",
  "structured solar-powered armor with iridescent surfaces",
  "elegant high-fashion futuristic suit with holographic lapels",
  "cyber-streetwear with oversized glowing accessories"
];

export default function App() {
  const [step, setStep] = useState<'welcome' | 'capture' | 'processing' | 'result'>('welcome');
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState(LANDMARKS[0]);
  const [selectedProps, setSelectedProps] = useState<string[]>([]);
  const [selectedWardrobe, setSelectedWardrobe] = useState(WARDROBE_STYLES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);

  const automateProps = () => {
    // Randomly select 1-2 props
    const shuffled = [...PROPS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 1).map(p => p.id);
    setSelectedProps(selected);
    
    // Randomly select wardrobe
    const randomWardrobe = WARDROBE_STYLES[Math.floor(Math.random() * WARDROBE_STYLES.length)];
    setSelectedWardrobe(randomWardrobe);
    
    setStep('capture');
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setStep('processing');
      processImage(imageSrc);
    }
  }, [webcamRef, selectedLandmark]);

  const processImage = async (base64Image: string, retryCount = 0) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Extract base64 data
      const base64Data = base64Image.split(',')[1];
      
      const propsPrompt = selectedProps.length > 0 
        ? `The person should be ${selectedProps.map(id => PROPS.find(p => p.id === id)?.prompt).join(' and ')}.`
        : '';

      const prompt = `Reimagine this person in a futuristic version of ${selectedLandmark.name} in Cairo in the year 2100. 
      ${propsPrompt}
      The person should be dressed in ${selectedWardrobe}.
      The scene should be cinematic, high-tech, and detailed. 
      CRITICAL: The iconic architecture and landmarks of Cairo MUST be clearly recognizable and accurately depicted. 
      ${selectedLandmark.id === 'tahrir' ? 'Specifically, include the historic AUC Tahrir Square Main Building (the Palace) AND the iconic red Egyptian Museum building. Both should be enhanced with futuristic elements like glowing holographic banners and vertical greenery.' : ''}
      ${selectedLandmark.id === 'nile' ? 'The person should be near the Qasr al-Nil Bridge. Include the iconic bronze LION statues at the bridge entrance, enhanced with glowing cybernetic details. Show futuristic felucca boats with solar sails on the bioluminescent Nile river.' : ''}
      ${selectedLandmark.id === 'downtown' ? 'Include the iconic Talaat Harb statue in the center of a futuristic downtown square. Also incorporate the Nahdet Misr (Egypt\'s Renaissance) statue by Mahmoud Mokhtar in the background, enhanced with holographic energy flows.' : ''}
      ${selectedLandmark.id === 'tower' ? 'Include the iconic Cairo Tower (lotus shape) as a central beacon of light, overlooking a high-tech city with the Nile river visible below.' : ''}
      Include elements like: ${selectedLandmark.description}. 
      Maintain the person's pose and likeness. 
      The style should be a mix of cyberpunk and solarpunk (vibrant neon mixed with lush greenery). 
      Use a color palette inspired by deep navy and vibrant pink (magenta).
      Add holographic AR overlays in the background like digital grids and energy symbols.
      Incorporate "FUTURE CAIRO" and "AUC Tahrir 2026 CultureFest" as subtle holographic branding elements within the environment.`;

      // Get the locally configured API key (Vite handles reading from .env.local via vite.config.ts)
      const localApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data, prompt, apiKey: localApiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side errors
        const errorData = data.error || data;
        const errorStr = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
        
        const isQuotaError = errorStr.toLowerCase().includes('429') || 
                             errorStr.toLowerCase().includes('resource_exhausted') || 
                             errorStr.toLowerCase().includes('quota') ||
                             errorStr.toLowerCase().includes('exhausted');

        const isKeyNotFoundError = errorStr.toLowerCase().includes('requested entity was not found') ||
                                   errorStr.toLowerCase().includes('api key not valid') ||
                                   data.code === 'MISSING_KEY';
        
        if (isQuotaError || isKeyNotFoundError) {
          setError('QUOTA_EXCEEDED');
          return;
        }

        throw new Error(errorStr || 'Failed to generate image');
      }

      if (data.image) {
        setResultImage(data.image);
        setStep('result');
      } else {
        throw new Error('No image was generated. Please try again.');
      }
    } catch (err: any) {
      console.error('Frontend Error:', err);
      
      const errorMsg = err.message || JSON.stringify(err) || '';
      
      // Exponential backoff for other retriable errors
      if (retryCount < 2 && (errorMsg.includes('500') || errorMsg.includes('503') || errorMsg.includes('deadline'))) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => processImage(base64Image, retryCount + 1), delay);
        return;
      }

      setError(errorMsg || 'Failed to generate your future self. Please try again.');
      setStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // After opening the dialog, we assume they might have selected a key
      // We can try to re-process if we have the image
      if (image) {
        processImage(image);
      }
    } catch (err) {
      console.error('Key selection error:', err);
    }
  };

  const reset = () => {
    setImage(null);
    setResultImage(null);
    setStep('welcome');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#001F3F] text-white font-sans selection:bg-[#FF007F]/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF007F]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00FFFF]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div className="flex flex-col">
            <div className="future-cairo-logo text-5xl md:text-7xl tracking-tighter text-[#FF007F]">
              FUTURE<br />CAIRO
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#001F3F] rounded-full" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">The American University in Cairo</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-right">
              <div className="text-xl font-bold tracking-tight text-white">AUCTahrir2026</div>
              <div className="text-sm font-serif italic text-[#FF007F]">CultureFest</div>
            </div>
            <div className="text-[10px] font-arabic text-white/50 text-right mt-1">
              القاهرة ٢١٠٠ | مستقبل القاهرة
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
            >
              <div className="space-y-4 max-w-2xl">
                <motion.h2 
                  className="text-5xl md:text-7xl font-bold tracking-tighter leading-none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="font-arabic block text-3xl mb-4 text-[#FF007F]">ادخل إلى المستقبل</span>
                  STEP INTO <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#00FFFF]">THE FUTURE.</span>
                </motion.h2>
                <p className="text-lg text-white/60 font-light max-w-lg mx-auto">
                  Experience downtown Cairo reimagined through the lens of artificial intelligence. 
                  Take a photo and let our neural networks transport you to the year 2100.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {LANDMARKS.map((landmark) => (
                  <button
                    key={landmark.id}
                    onClick={() => setSelectedLandmark(landmark)}
                    className={cn(
                      "p-6 text-left transition-all duration-300 border rounded-2xl group relative overflow-hidden",
                      selectedLandmark.id === landmark.id 
                        ? "bg-white/5 border-[#FF007F]/50 ring-1 ring-[#FF007F]/50" 
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <MapPin className={cn("w-5 h-5", selectedLandmark.id === landmark.id ? "text-[#FF007F]" : "text-white/30")} />
                        <span className="font-arabic text-[10px] text-white/40">{landmark.nameAr}</span>
                      </div>
                      <h3 className="font-bold text-lg">{landmark.name}</h3>
                      <p className="text-xs text-white/50 mt-1 leading-relaxed">{landmark.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={automateProps}
                className="group relative px-12 py-4 bg-[#FF007F] text-white font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,127,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest">
                  Initialize Capture <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </motion.div>
          )}

          {step === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col space-y-6"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    NEURAL CAPTURE <span className="font-arabic text-lg text-[#FF007F]">التقاط عصبي</span>
                  </h2>
                  <p className="text-sm text-[#FF007F] font-mono uppercase tracking-widest">Target: {selectedLandmark.name}</p>
                </div>
                <button 
                  onClick={() => setStep('welcome')}
                  className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  [ Cancel Session ]
                </button>
              </div>

              <div className="relative aspect-[4/3] w-full bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Animated Background Overlay */}
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  >
                    <source src={selectedLandmark.video} type="video/mp4" />
                  </video>
                </div>

                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user", aspectRatio: 4/3 }}
                  className="relative z-10 w-full h-full object-cover grayscale contrast-125 brightness-75 mix-blend-lighten"
                  mirrored={false}
                  imageSmoothing={true}
                  forceScreenshotSourceSize={false}
                  disablePictureInPicture={false}
                  onUserMedia={() => {}}
                  onUserMediaError={() => {}}
                  screenshotQuality={0.92}
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="scanline" />
                  
                  {/* AR Overlays based on landmark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedLandmark.id === 'tahrir' && (
                      <div className="w-full h-full border-[20px] border-[#FF007F]/10 grid grid-cols-8 grid-rows-6 opacity-20">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div key={i} className="border border-[#FF007F]/20" />
                        ))}
                      </div>
                    )}
                    {selectedLandmark.id === 'tower' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#FF007F]/0 via-[#FF007F]/40 to-[#FF007F]/0 blur-sm" />
                    )}
                    {selectedLandmark.id === 'nile' && (
                      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#FF007F]/20 to-transparent animate-pulse" />
                    )}
                  </div>

                  <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#FF007F]/50" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#FF007F]/50" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#FF007F]/50" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#FF007F]/50" />
                  
                  {/* Selected Props Preview Labels */}
                  <div className="absolute top-8 left-24 flex flex-col gap-2">
                    <div className="px-2 py-1 bg-[#FF007F]/20 border border-[#FF007F]/40 rounded text-[8px] font-mono text-[#FF007F] uppercase flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#FF007F] rounded-full animate-pulse" />
                      WARDROBE: {selectedWardrobe.split(' ')[0]} [SYNTHESIZING]
                    </div>
                    {selectedProps.map(id => (
                      <div key={id} className="px-2 py-1 bg-[#FF007F]/20 border border-[#FF007F]/40 rounded text-[8px] font-mono text-[#FF007F] uppercase flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#FF007F] rounded-full animate-pulse" />
                        {PROPS.find(p => p.id === id)?.name} [AUTO-EQUIPPED]
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-8">
                  <button
                    onClick={capture}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-transform hover:scale-110 active:scale-90 group"
                  >
                    <div className="w-16 h-16 border-2 border-[#001F3F] rounded-full flex items-center justify-center">
                      <Camera className="text-[#001F3F] w-8 h-8 group-hover:rotate-12 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center items-center space-y-12"
            >
              {error === 'QUOTA_EXCEEDED' ? (
                <div className="bg-black/80 backdrop-blur-xl border border-[#FF007F]/30 p-8 rounded-3xl max-w-md text-center">
                  <div className="w-16 h-16 bg-[#FF007F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-[#FF007F]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Neural Quota Reached</h3>
                  <p className="text-white/70 mb-8 text-sm leading-relaxed">
                    The public neural link is currently overloaded. To continue generating high-resolution futures without limits, please connect your personal API key from a paid Google Cloud project.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={handleSelectKey}
                      className="w-full py-4 bg-[#FF007F] text-white rounded-xl font-bold hover:bg-[#FF007F]/80 transition-all shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2"
                    >
                      <Key className="w-5 h-5" />
                      Connect Personal Key
                    </button>
                    <button
                      onClick={() => { setError(null); setStep('capture'); }}
                      className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
                    >
                      Try Again Later
                    </button>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 text-left">
                    <h4 className="text-[10px] font-bold text-[#00FFFF] uppercase tracking-widest mb-2">Instructions:</h4>
                    <ol className="text-[9px] text-white/50 space-y-1 list-decimal ml-3">
                      <li>Ensure you have a Google Cloud project with billing enabled.</li>
                      <li>Generate an API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#FF007F] underline">AI Studio</a>.</li>
                      <li>Click the button above and select your key.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="w-48 h-48 border-4 border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" 
                       />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold tracking-tighter">REIMAGINING REALITY</h2>
                    <div className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                      >
                        Synthesizing Future Cairo...
                      </motion.span>
                      <span className="font-arabic text-lg text-[#FF007F] animate-pulse">مستقبل القاهرة ٢١٠٠</span>
                      <span className="text-white/30">Neural Core Processing @ 4.2 THz</span>
                    </div>
                  </div>

                  <div className="w-full max-w-md bg-white/5 rounded-full h-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 15, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'result' && resultImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    TRANSMISSION COMPLETE <span className="font-arabic text-lg text-[#FF007F]">اكتمل الإرسال</span>
                  </h2>
                  <p className="text-sm text-[#FF007F] font-mono uppercase tracking-widest">Location: {selectedLandmark.name} | Year: 2100</p>
                </div>
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> New Session
                </button>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF007F] to-[#00FFFF] rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-[#001F3F] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={resultImage} 
                    alt="Your future self in Cairo" 
                    className="w-full aspect-[4/3] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Branding Overlay */}
                  <div className="absolute top-6 left-6 pointer-events-none">
                    <div className="flex flex-col">
                      <div className="future-cairo-logo text-2xl tracking-tighter text-[#FF007F]">
                        FUTURE<br />CAIRO
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-[#001F3F] rounded-full" />
                        </div>
                        <span className="text-[6px] font-bold tracking-widest uppercase text-white/80">AUC Tahrir 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Text Overlay (Correctly Rendered) */}
                  <div className="absolute top-6 right-8 text-right pointer-events-none">
                    <div className="font-arabic text-3xl font-bold text-white neon-text-pink leading-none">
                      مستقبل
                    </div>
                    <div className="font-arabic text-3xl font-bold text-white neon-text-pink leading-none">
                      القاهرة
                    </div>
                    <div className="mt-2 font-arabic text-sm text-[#00FFFF] tracking-widest opacity-90 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                      القاهرة ٢١٠٠
                    </div>
                  </div>
                  
                  {/* Watermark/HUD */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                      <div className="text-[10px] font-mono text-[#FF007F] uppercase tracking-tighter">Temporal Signature</div>
                      <div className="text-xs font-bold tracking-widest uppercase">CAI-2100-AUTH</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-mono text-white/40 uppercase">Processed by</div>
                      <div className="text-[10px] font-bold tracking-widest uppercase">Gemini Neural Engine</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={resultImage}
                  download="future-cairo-2100.png"
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#001F3F] font-bold rounded-2xl hover:bg-[#FF007F] hover:text-white transition-colors"
                >
                  <Download className="w-5 h-5" /> Save Memory
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'My Future in Cairo',
                        text: 'Check out my photo from the year 2100 in Cairo!',
                        url: window.location.href,
                      });
                    }
                  }}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/20 font-bold rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <Share2 className="w-5 h-5" /> Share Future
                </button>
              </div>
              
              <div className="p-6 glass-panel space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF007F] flex items-center gap-2">
                  <Info className="w-4 h-4" /> Historical Note: {selectedLandmark.name}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  By 2100, {selectedLandmark.name} has become a global model for sustainable urban living. 
                  The integration of ancient Egyptian architectural principles with hyper-advanced materials 
                  has created a city that is both a living museum and a beacon of human progress.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <p>© 2100 Cairo Urban Development Authority | AUC Tahrir 2026</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF007F] transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-[#FF007F] transition-colors">Neural Terms</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
