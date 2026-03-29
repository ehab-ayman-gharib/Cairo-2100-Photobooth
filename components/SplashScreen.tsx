import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EraData } from '../types';
import { ERAS } from '../constants';

interface SplashScreenProps {
  onStart: () => void;
  onSelectEra: (era: EraData) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onSelectEra, isMuted, setIsMuted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const isExitingRef = useRef(false);

  const unmuteVideo = () => {
    // Enable Audio
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }

    // Trigger Fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const handleInteraction = () => {
    unmuteVideo();
  };

  const handleVideoEnded = () => {
    if (isExiting) return;

    setIsExiting(true);
    isExitingRef.current = true;
    
    // Select random era
    const randomEra = ERAS[Math.floor(Math.random() * ERAS.length)];
    
    setTimeout(() => {
      onSelectEra(randomEra);
    }, 1800);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    // Scene background should be transparent to see the image below

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 10;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // --- Magical Particles ---
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 400; // Increased count for better look
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create texture for glow
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 215, 0, 1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.Texture(canvas);
    particleTexture.needsUpdate = true;

    const particlesMat = new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffd700
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);


    // --- Animation Loop ---
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      const isExitingNow = isExitingRef.current;

      // Animate Particles
      particleSystem.rotation.y = time * 0.05;
      particleSystem.rotation.x = time * 0.02;

      if (isExitingNow) {
        particlesMat.opacity -= 0.02;
        camera.position.z -= 0.1;
      } else {
        camera.position.x = Math.sin(time * 0.2) * 0.5;
        camera.position.y = Math.cos(time * 0.1) * 0.5;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, []);

  return (
    <div
      className="h-full w-full relative overflow-hidden bg-black"
      onClick={handleInteraction}
    >
      {/* Background Video Layer */}
      <div
        className={`absolute inset-0 transition-all duration-[1800ms] ease-in-out ${isExiting ? 'opacity-0 scale-110 blur-2xl' : 'opacity-100 scale-100'}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover"
          src="./isis_test.mp4"
        />
      </div>

      {/* Particles Layer (Three.js) */}
      <div ref={mountRef} className="absolute inset-0 z-[5] pointer-events-none" />

    </div>
  );
};