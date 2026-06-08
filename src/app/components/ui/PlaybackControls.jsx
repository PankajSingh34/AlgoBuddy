import React from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Bot } from "lucide-react";

export default function PlaybackControls({
  isPlaying,
  onPlayPause,
  speed,
  onIncreaseSpeed,
  onDecreaseSpeed,
  onSpeedChange,
  disabled = false,
  showPlayPause = true,
  onStepForward,
  onStepBackward,
  onReset,
  onClear,
  clearLabel = "Clear",
  progressText,
  onExplainStep,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-3 md:p-4 rounded-2xl shadow-lg shadow-black/20 gap-4">
      {/* Play/Pause Button & Frame Stepping */}
      {showPlayPause && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center bg-slate-950/70 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
          {onStepBackward && (
            <button
              type="button"
              onClick={onStepBackward}
              disabled={disabled}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Step"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <button
            type="button"
            onClick={onPlayPause}
            disabled={disabled}
            className="flex items-center justify-center bg-[#a435f0] text-white w-10 h-10 rounded-full hover:bg-[#8f2cd6] transition-all shadow-md shadow-[#a435f0]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isPlaying ? "Play" : "Pause"}
          >
            {!isPlaying ? <Play size={20} className="fill-current ml-1" /> : <Pause size={20} className="fill-current" />}
          </button>

          {onStepForward && (
            <button
              type="button"
              onClick={onStepForward}
              disabled={disabled}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Step"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-1"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      )}

      {/* Clear Button */}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30 flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <RotateCcw size={14} /> {clearLabel}
        </button>
      )}

      {/* Explain Step Button */}
      {onExplainStep && (
        <button
          type="button"
          onClick={onExplainStep}
          disabled={disabled}
          className="px-3.5 py-2 text-xs font-bold text-[#c084fc] bg-[#3b0764]/40 hover:bg-[#3b0764]/70 rounded-xl transition-all border border-[#c084fc]/30 flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-md shadow-[#a435f0]/10"
        >
          <Bot size={14} /> Explain this step
        </button>
      )}

      {/* Speed Controls */}
      <div className="flex items-center gap-3 bg-slate-950/70 px-5 py-2 rounded-full border border-slate-800/80 shadow-inner h-10">
        <span className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest select-none">
          SPEED
        </span>

        {onSpeedChange ? (
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-20 sm:w-24 accent-[#a435f0] cursor-pointer"
            disabled={disabled}
          />
        ) : null}

        <span className="text-[#c084fc] font-black text-xs sm:text-sm min-w-[28px] text-right select-none">
          {speed}x
        </span>
      </div>

      {progressText && (
        <div className="hidden lg:block text-right bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PROGRESS</div>
          <div className="text-sm font-bold text-slate-200">
            {progressText}
          </div>
        </div>
      )}

    </div>
  );
}
