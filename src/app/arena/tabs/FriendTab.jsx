import React, { useState } from "react";
import { Users, Swords } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FriendTab({ joinCode, setJoinCode, handleJoinDuel, openCreateDuelModal }) {
  const [duelMode, setDuelMode] = useState("Standard");
  const [duelTopic, setDuelTopic] = useState("Random");
  const [duelDifficulty, setDuelDifficulty] = useState("Medium");
  const [duelTime, setDuelTime] = useState("30m");
  const [duelWager, setDuelWager] = useState(0);
  const [duelPublic, setDuelPublic] = useState(false);

  const handleJoinLobby = () => {
    if (handleJoinDuel) {
      handleJoinDuel(joinCode);
    } else {
      toast.success(`Joining lobby ${joinCode}...`);
    }
  };

  return (
    <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Play with Friends</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Create a private lobby and invite your friends to a custom code duel.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Lobby Settings</h5>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mode</label>
                            <div className="flex gap-2">
                              {["Standard", "Optimization"].map(mode => (
                                <button 
                                  key={mode} 
                                  onClick={() => setDuelMode(mode)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelMode === mode ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Topic</label>
                            <select
                              value={duelTopic}
                              onChange={(e) => setDuelTopic(e.target.value)}
                              className="w-full py-2 px-3 text-xs font-bold rounded-lg border bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 focus:outline-none focus:border-primary/50 transition"
                            >
                              <option value="Random">Random</option>
                              <option value="Arrays">Arrays</option>
                              <option value="Strings">Strings</option>
                              <option value="Hash Tables">Hash Tables</option>
                              <option value="Two Pointers">Two Pointers</option>
                              <option value="Dynamic Programming">Dynamic Programming</option>
                              <option value="Graphs">Graphs</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Difficulty</label>
                            <div className="flex gap-2">
                              {["Easy", "Medium", "Hard"].map(diff => (
                                <button 
                                  key={diff} 
                                  onClick={() => setDuelDifficulty(diff)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelDifficulty === diff ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {diff}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Time Limit</label>
                            <div className="flex gap-2">
                              {["15m", "30m", "60m"].map(time => (
                                <button 
                                  key={time} 
                                  onClick={() => setDuelTime(time)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelTime === time ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">XP Wager</label>
                              <span className="text-xs font-bold text-primary">{duelWager} XP</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="500" 
                              step="10" 
                              value={duelWager}
                              onChange={(e) => setDuelWager(Number(e.target.value))}
                              className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1">
                              <span>0</span>
                              <span>250</span>
                              <span>500</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">Public Lobby</span>
                              <span className="text-[10px] text-slate-500">Allow anyone to join your duel</span>
                            </div>
                            <button
                              onClick={() => setDuelPublic(!duelPublic)}
                              className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${duelPublic ? "bg-primary" : "bg-slate-300 dark:bg-neutral-600"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${duelPublic ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Invite Players</h5>
                          
                          <div className="flex-1 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                            <Users size={32} className="text-slate-300 dark:text-neutral-600" />
                            <p className="text-[10px] text-slate-500 max-w-[150px]">Create the lobby to generate an invite code.</p>
                            <button
                              onClick={openCreateDuelModal}
                              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
                            >
                              Generate Invite Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 mt-4">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 space-y-2">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Join an Existing Lobby</h5>
                          <p className="text-xs text-slate-500">Have an invite code from a friend? Enter it below to join their custom duel.</p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="w-full md:w-48 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-primary/50 transition placeholder:normal-case placeholder:tracking-normal"
                          />
                          <button
                            onClick={handleJoinLobby}
                            disabled={joinCode.length !== 6}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center ${joinCode.length === 6 ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-600 cursor-not-allowed"}`}
                          >
                            Join Lobby
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  );
}
