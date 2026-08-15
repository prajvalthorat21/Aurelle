import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad on desktop)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handlePointerChange);
    }

    if (!mediaQuery.matches) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = reducedMotionQuery.matches;

    // High performance rAF loop variables (bypasses React state to maintain 60/120fps)
    let reqId: number;
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let currentCursorState = 'default';
    let currentLabelText = '';
    let isMagnetic = false;
    let magneticTargetX = 0;
    let magneticTargetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Inspect hovered element for data-cursor attribute
      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest('[data-cursor]') as HTMLElement | null;

      if (cursorEl) {
        const state = cursorEl.getAttribute('data-cursor') || 'interactive';
        currentCursorState = state;

        if (state === 'explore') {
          currentLabelText = 'EXPLORE';
        } else if (state === 'view') {
          currentLabelText = 'VIEW';
        } else {
          currentLabelText = '';
        }

        if ((state === 'magnetic' || cursorEl.hasAttribute('data-cursor-magnetic')) && !prefersReducedMotion) {
          isMagnetic = true;
          const rect = cursorEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Calculate max 6px magnetic attraction towards element center
          const deltaX = (centerX - mouseX) * 0.16;
          const deltaY = (centerY - mouseY) * 0.16;
          magneticTargetX = Math.max(-6, Math.min(6, deltaX));
          magneticTargetY = Math.max(-6, Math.min(6, deltaY));
        } else {
          isMagnetic = false;
          magneticTargetX = 0;
          magneticTargetY = 0;
        }
      } else {
        // Fallback checks for standard links & buttons
        const isInteractive = target?.closest('a, button, [role="button"], input, select');
        if (isInteractive) {
          currentCursorState = 'interactive';
          currentLabelText = '';
        } else {
          currentCursorState = 'default';
          currentLabelText = '';
        }
        isMagnetic = false;
        magneticTargetX = 0;
        magneticTargetY = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render loop
    const render = () => {
      const targetX = mouseX + (isMagnetic ? magneticTargetX : 0);
      const targetY = mouseY + (isMagnetic ? magneticTargetY : 0);

      // Lerp positioning (~35ms smooth latency; 1.0 lock for reduced motion)
      const lerpFactor = prefersReducedMotion ? 1.0 : 0.24;
      cursorX += (targetX - cursorX) * lerpFactor;
      cursorY += (targetY - cursorY) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        cursorRef.current.setAttribute('data-state', currentCursorState);
      }

      if (labelRef.current) {
        if (currentLabelText) {
          labelRef.current.textContent = currentLabelText;
          labelRef.current.style.opacity = '1';
        } else {
          labelRef.current.style.opacity = '0';
        }
      }

      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handlePointerChange);
      }
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <div ref={cursorRef} className="custom-cursor-wrapper" aria-hidden="true" data-state="default">
      <svg
        className="custom-cursor-crosshair"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top vertical crosshair line */}
        <line x1="16" y1="2" x2="16" y2="9" stroke="#F5F3EE" strokeWidth="1" strokeLinecap="round" className="crosshair-line line-top" />
        {/* Bottom vertical crosshair line */}
        <line x1="16" y1="23" x2="16" y2="30" stroke="#F5F3EE" strokeWidth="1" strokeLinecap="round" className="crosshair-line line-bottom" />
        {/* Left horizontal crosshair line */}
        <line x1="2" y1="16" x2="9" y2="16" stroke="#F5F3EE" strokeWidth="1" strokeLinecap="round" className="crosshair-line line-left" />
        {/* Right horizontal crosshair line */}
        <line x1="23" y1="16" x2="30" y2="16" stroke="#F5F3EE" strokeWidth="1" strokeLinecap="round" className="crosshair-line line-right" />

        {/* Center Faceted Champagne Gold Diamond */}
        <polygon points="16,11 21,16 16,21 11,16" stroke="#B89252" strokeWidth="1" fill="#F5F3EE" fillOpacity="0.2" className="crosshair-diamond" />
        {/* Center Optical Point */}
        <circle cx="16" cy="16" r="0.75" fill="#F5F3EE" />
      </svg>
      <span ref={labelRef} className="custom-cursor-label" />
    </div>
  );
};

export default CustomCursor;
