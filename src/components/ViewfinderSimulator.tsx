import React, { useState } from 'react';
import { Opt, Cloth, Loc } from '../types/studio';

interface ViewfinderSimulatorProps {
  frame: Opt;
  aspect: Opt;
  phone: Opt;
  angle: Opt;
  light: Opt;
  cloth: Cloth;
  loc: Loc;
  carModel: Opt;
  carColor: Opt;
  hair: Opt;
  beard: Opt;
  appUis: Opt[];
  tint: Opt;
  subsurfaces: Opt[];
}

export const ViewfinderSimulator: React.FC<ViewfinderSimulatorProps> = ({
  frame,
  aspect,
  phone,
  angle,
  light,
  cloth,
  loc,
  carModel,
  carColor,
  hair,
  beard,
  appUis,
  tint,
  subsurfaces,
}) => {
  const [showGrid, setShowGrid] = useState(true);

  // Compute aspect ratio CSS classes
  const aspectClass =
    aspect.id === '916'
      ? 'aspect-[9/16] max-w-[240px]'
      : aspect.id === '45'
      ? 'aspect-[4/5] max-w-[260px]'
      : aspect.id === '11'
      ? 'aspect-square max-w-[280px]'
      : 'aspect-[16/9] max-w-[340px]';

  // Angle transforms for perspective simulation
  const angleTransform =
    angle.id === 'high_45'
      ? 'scale(1.05) perspective(600px) rotateX(12deg)'
      : angle.id === 'chest_low'
      ? 'scale(1.08) perspective(600px) rotateX(-10deg) translateY(-8px)'
      : angle.id === 'candid_side'
      ? 'scale(1.02) rotate(-3.5deg) translateX(6px)'
      : 'scale(1)';

  // Lighting overlay style supporting all 19 standalone lighting styles
  const getLightingGradient = () => {
    switch (light.id) {
      case 'golden_hour':
      case 'afternoon_diffuse':
        return 'from-amber-500/25 via-orange-400/10 to-transparent';
      case 'harsh_noon':
        return 'from-amber-100/35 via-zinc-900/10 to-black/40';
      case 'soft_morning':
        return 'from-amber-200/25 via-sky-100/10 to-transparent';
      case 'sunset_glow':
        return 'from-rose-600/30 via-orange-500/15 to-transparent';
      case 'blue_hour':
        return 'from-blue-600/25 via-indigo-900/20 to-black/40';
      case 'overcast_haze':
        return 'from-slate-300/20 via-zinc-700/10 to-transparent';
      case 'sodium_street':
        return 'from-amber-600/35 via-orange-500/20 to-zinc-950/40';
      case 'led_modern_street':
        return 'from-slate-100/25 via-blue-100/10 to-transparent';
      case 'direct_flash':
        return 'from-white/45 via-transparent to-black/60';
      case 'station_canopy':
      case 'basement_tubes':
        return 'from-white/40 via-neutral-100/15 to-transparent';
      case 'dash_screens_glow':
        return 'from-cyan-500/25 via-blue-600/15 to-transparent';
      case 'warm_car_cabin_dome':
      case 'tunnel_tungsten':
      case 'single_distant_lamp':
        return 'from-amber-400/30 via-yellow-600/15 to-transparent';
      case 'pure_moonlight':
        return 'from-slate-200/20 via-sky-950/30 to-black/60';
      case 'neon_side_wash':
      case 'ambient_drive_thru':
        return 'from-pink-500/20 via-cyan-500/15 to-transparent';
      case 'headlights_bounce':
        return 'from-amber-100/30 via-transparent to-black/50';
      default:
        return 'from-amber-600/15 via-zinc-900/10 to-transparent';
    }
  };

  const hasSnapStamp = appUis.some(u => u.id === 'snap_timestamp');
  const hasSnapTemp = appUis.some(u => u.id === 'snap_temp_sticker');
  const hasEarGlow = subsurfaces.some(s => s.id === 'ear_cartilage_glow');
  const isTraditional = cloth.cat === 'تقليدي';

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-between shadow-xl">
      {/* Simulator Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-100">محاكي الكاميرا والكادر الحي</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-0.5 rounded font-mono transition ${
              showGrid ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="تبديل شبكة التثليث"
          >
            3x3 {showGrid ? 'ON' : 'OFF'}
          </button>
          <span className="text-zinc-500 font-mono">{aspect.ar.split(' ')[0]}</span>
        </div>
      </div>

      {/* Interactive Smartphone Viewfinder Viewport */}
      <div className="w-full flex items-center justify-center p-2 min-h-[360px] md:min-h-[420px] bg-zinc-950/70 rounded-xl relative overflow-hidden border border-zinc-800/60">
        <div
          className={`relative w-full ${aspectClass} mx-auto bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl transition-all duration-300 flex flex-col justify-between`}
          style={{ transform: angleTransform }}
        >
          {/* Incidental Background Simulation (Car Cabin or Outdoor) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {loc.zone === 'inside' ? (
              <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                {/* Windshield & A-Pillars */}
                <path d="M 10,0 L 25,60 L 0,100 L 0,0 Z" fill="#18181b" />
                <path d="M 90,0 L 75,60 L 100,100 L 100,0 Z" fill="#18181b" />
                {/* Rear Window & Headrest */}
                <rect x="25" y="10" width="50" height="35" rx="4" fill="#09090b" opacity="0.6" />
                {/* Seat Headrest adjusted for 193cm */}
                <rect x="35" y="22" width="30" height="28" rx="8" fill="#27272a" />
                <line x1="42" y1="50" x2="42" y2="60" stroke="#3f3f46" strokeWidth="2" />
                <line x1="58" y1="50" x2="58" y2="60" stroke="#3f3f46" strokeWidth="2" />
                {/* Steering wheel curvature in corner */}
                <ellipse cx="12" cy="95" rx="35" ry="30" fill="none" stroke="#3f3f46" strokeWidth="5" />
              </svg>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                {/* Outdoor sky & subtle car hood contour */}
                <rect x="0" y="0" width="100" height="65" fill="#1c1917" />
                <path d="M 0,75 Q 50,65 100,80 L 100,100 L 0,100 Z" fill="#292524" />
                {/* Distant vehicle silhouette */}
                <path d="M 60,65 L 75,55 L 95,55 L 100,65 Z" fill="#44403c" opacity="0.5" />
              </svg>
            )}
          </div>

          {/* Dynamic Light Gradient Vector */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${getLightingGradient()} pointer-events-none`} />

          {/* Dominant Subject Silhouette (Occupying 80% Foreground) */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none z-10 pb-0">
            <svg
              viewBox="0 0 200 240"
              className={`w-full h-[88%] object-contain transition-all duration-300 ${
                frame.id === 'close_face'
                  ? 'scale-125 translate-y-6'
                  : frame.id === 'half_body'
                  ? 'scale-100 translate-y-0'
                  : 'scale-90 translate-y-[-6px]'
              }`}
            >
              <defs>
                <linearGradient id="bodySkin" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#92400e" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="attireGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isTraditional ? '#f8fafc' : '#27272a'}
                  />
                  <stop
                    offset="100%"
                    stopColor={isTraditional ? '#e2e8f0' : '#18181b'}
                  />
                </linearGradient>
              </defs>

              {/* Athletic Broad Shoulders (193cm Scale - filling lower 50%) */}
              <path
                d="M 5,240 C 20,165 40,150 75,145 L 125,145 C 160,150 180,165 195,240 Z"
                fill="url(#attireGrad)"
                stroke={isTraditional ? '#cbd5e1' : '#3f3f46'}
                strokeWidth="1.5"
              />

              {/* Collar Detail */}
              {isTraditional ? (
                <path d="M 85,145 L 100,165 L 115,145 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              ) : (
                <path d="M 82,145 Q 100,160 118,145" fill="none" stroke="#52525b" strokeWidth="2" />
              )}

              {/* Tall Athletic Neck */}
              <rect x="88" y="115" width="24" height="32" rx="4" fill="url(#bodySkin)" />

              {/* Ear with Subsurface scattering if active */}
              <ellipse cx="64" cy="98" rx="6" ry="10" fill={hasEarGlow ? '#ef4444' : '#b45309'} />
              <ellipse cx="136" cy="98" rx="6" ry="10" fill="#b45309" />

              {/* Defined Jawline & Head Structure */}
              <ellipse cx="100" cy="95" rx="34" ry="42" fill="url(#bodySkin)" />

              {/* Headwear / Hair flow */}
              {hair.id === 'covered_traditional' ? (
                <path
                  d="M 55,75 Q 100,30 145,75 C 150,110 148,150 135,170 C 115,175 85,175 65,170 C 52,150 50,110 55,75 Z"
                  fill="#f1f5f9"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              ) : (
                <path
                  d="M 64,85 Q 65,46 100,44 Q 135,46 136,85 Q 120,60 100,62 Q 80,60 64,85 Z"
                  fill="#18181b"
                />
              )}

              {/* Eyes & Warm Gaze */}
              <ellipse cx="88" cy="90" rx="3.5" ry="2" fill="#292524" />
              <circle cx="89" cy="89" r="1" fill="#fef08a" />
              <ellipse cx="112" cy="90" rx="3.5" ry="2" fill="#292524" />
              <circle cx="113" cy="89" r="1" fill="#fef08a" />

              {/* Eyebrows */}
              <path d="M 80,85 Q 88,82 95,86" stroke="#1c1917" strokeWidth="2" fill="none" />
              <path d="M 105,86 Q 112,82 120,85" stroke="#1c1917" strokeWidth="2" fill="none" />

              {/* Nose Bridge */}
              <line x1="100" y1="88" x2="100" y2="102" stroke="#92400e" strokeWidth="1.5" />
              <line x1="97" y1="102" x2="103" y2="102" stroke="#92400e" strokeWidth="1.5" />

              {/* Signature Locked Beard & Mustache */}
              <path
                d="M 86,106 Q 100,109 114,106 L 112,112 Q 100,114 88,112 Z"
                fill="#18181b"
              />
              <path
                d="M 72,96 Q 72,130 100,135 Q 128,130 128,96 Q 120,126 100,128 Q 80,126 72,96 Z"
                fill="#1c1917"
                opacity="0.92"
              />

              {/* Warm Smile Lips */}
              <path d="M 92,115 Q 100,120 108,115" stroke="#991b1b" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Rule of Thirds Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>
          )}

          {/* Social Media UI Simulation (Snapchat / Instagram Overlays) */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20 text-[10px] font-mono text-white/90">
            {hasSnapStamp ? (
              <span className="bg-black/40 backdrop-blur px-1.5 py-0.5 rounded shadow">
                04:35 PM
              </span>
            ) : (
              <span className="opacity-70">4K HDR</span>
            )}
            {hasSnapTemp && (
              <span className="bg-black/40 backdrop-blur px-1.5 py-0.5 rounded shadow text-amber-300">
                43°C
              </span>
            )}
          </div>

          {/* Camera Crosshair Center Marker */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-30">
            <div className="w-8 h-8 border border-white/60 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
          </div>

          {/* Viewfinder Bottom Status Pill */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20 text-[10px] text-zinc-300 font-mono bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
            <span className="truncate max-w-[120px]">{phone.ar.split(' ')[0]}</span>
            <span className="text-emerald-400 font-bold">80% كادر المرجع</span>
          </div>
        </div>
      </div>

      {/* Simulator Metrics Ribbon */}
      <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-[11px] pt-2 border-t border-zinc-800">
        <div className="p-2 rounded-xl bg-zinc-800/50">
          <span className="opacity-50 block text-[9px]">الزاوية والتأطير</span>
          <span className="font-semibold text-zinc-200 truncate block">{angle.ar.split(' ')[0]}</span>
        </div>
        <div className="p-2 rounded-xl bg-zinc-800/50">
          <span className="opacity-50 block text-[9px]">الإنارة المستقلة</span>
          <span className="font-semibold text-amber-300 truncate block">{light.ar.slice(0, 14)}...</span>
        </div>
        <div className="p-2 rounded-xl bg-zinc-800/50">
          <span className="opacity-50 block text-[9px]">المكان الـ 40</span>
          <span className="font-semibold text-zinc-200 truncate block">{loc.ar.slice(0, 14)}...</span>
        </div>
      </div>
    </div>
  );
};
