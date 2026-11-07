'use client';

import { useState } from 'react';
import { ToolIcon } from './tool-icon';

export function Toolbench() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative mx-auto aspect-[1.15] w-full max-w-[560px] text-[#e8dfcd]">
      <svg viewBox="0 0 560 480" fill="none" aria-hidden="true" className="absolute inset-0 size-full">
        <path d="M30 405h500M65 70h430v335H65z" stroke="currentColor" strokeOpacity=".15" />
        <path d="m90 365 380-270M85 260l365 100" stroke="currentColor" strokeOpacity=".12" strokeDasharray="4 8" />
        <circle cx="280" cy="240" r="160" stroke="currentColor" strokeOpacity=".12" />
        <path d="M60 425h440l-30 22H90z" fill="#d5b994" />
        <path d="M95 447v28m370-28v28" stroke="#d5b994" strokeWidth="12" />
        <path d="M215 195h210v145H215z" fill="#f4efe3" transform="rotate(-9 215 195)" />
        <path d="m245 220 90-14 13 81-91 14zM260 242l34-5 8 45m-1-59 23-4" stroke="#1b2951" strokeOpacity=".5" strokeWidth="2" />
      </svg>
      <div className={`absolute top-[7%] left-[13%] w-[24%] -rotate-12 ${paused ? '' : 'motion-safe:animate-[bounce_5s_ease-in-out_infinite]'}`}>
        <ToolIcon name="hammer" className="w-full" />
      </div>
      <div className={`absolute top-[4%] right-[13%] w-[24%] rotate-12 text-[#d5936d] ${paused ? '' : 'motion-safe:animate-[bounce_6s_ease-in-out_infinite]'}`}>
        <ToolIcon name="wrench" className="w-full" />
      </div>
      <div className={`absolute bottom-[20%] left-[12%] w-[20%] -rotate-12 text-[#d5936d] ${paused ? '' : 'motion-safe:animate-[bounce_7s_ease-in-out_infinite]'}`}>
        <ToolIcon name="roller" className="w-full" />
      </div>
      <div className="absolute top-[51%] right-[9%] w-[15%] rotate-12">
        <ToolIcon name="drawing" className="w-full text-(--site-accent)" />
      </div>
      <span className="absolute top-[42%] left-[9%] text-[10px] tracking-[0.2em] uppercase opacity-60">Measure twice.</span>
      <span className="absolute right-[10%] bottom-[5%] text-[10px] tracking-[0.2em] uppercase opacity-60">Make it yours.</span>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="absolute bottom-[-16px] left-1/2 min-h-11 -translate-x-1/2 cursor-pointer border-b border-white/30 text-[11px] text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hidden">
        {paused ? 'Play tool animations' : 'Pause tool animations'}
      </button>
    </div>
  );
}
