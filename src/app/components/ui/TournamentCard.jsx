"use client";
import { useState } from "react";
import { Users, Clock, Trophy, Calendar, Check, Loader2, Award } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TournamentCard({ tournament }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleRegister = () => {
    setIsRegistering(true);
    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
      toast.success(`Successfully registered for ${tournament.title}!`);
    }, 1500);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col md:flex-row gap-5 items-start md:items-center hover:-translate-y-1"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
          }}
        />
      )}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-colors duration-500 ${tournament.color || 'bg-primary/5 group-hover:bg-primary/10'}`}></div>
      
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tournament.iconBg || 'bg-primary/10 text-primary'}`}>
        <Trophy size={32} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-lg text-slate-800 dark:text-neutral-100">{tournament.title}</h4>
          {tournament.status === "live" && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 animate-pulse">Live Now</span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mb-4 line-clamp-1">{tournament.description}</p>
        
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 dark:text-neutral-300">
          <div className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {tournament.date}</div>
          <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {tournament.duration}</div>
          <div className="flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> {tournament.participants} Enrolled</div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900/50 rounded-xl p-4 min-w-[140px] border border-slate-100 dark:border-neutral-800 group/prize relative overflow-hidden transition-all hover:border-amber-500/30 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] cursor-default">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/0 to-amber-400/0 group-hover/prize:to-amber-400/5 transition-colors"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 z-10">Prize Pool</span>
        
        <div className="flex items-center justify-center gap-1.5 mb-3 z-10 transition-transform duration-300 group-hover/prize:scale-110 group-hover/prize:-translate-y-1">
          <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shadow-inner ring-1 ring-amber-400/50 relative">
            <span className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm opacity-0 group-hover/prize:opacity-100 transition-opacity"></span>
            <Award size={12} className="text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-lg font-black text-amber-500 drop-shadow-sm">{tournament.prize}</span>
        </div>
        
        {tournament.status === "upcoming" && (
          <button
            onClick={handleRegister}
            disabled={isRegistered || isRegistering}
            className={`w-full py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isRegistered
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg"
            }`}
          >
            {isRegistering ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isRegistered ? (
              <>
                <Check size={14} /> Registered
              </>
            ) : (
              "Register Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
