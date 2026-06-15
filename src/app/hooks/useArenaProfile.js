import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function springBootBase() {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8080";
    }
  }
  return "https://algobuddy-backend-7iwv.onrender.com";
}

export function useArenaProfile(user) {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) {
          throw new Error("No access token found");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(`${springBootBase()}/api/v1/arena/profile`, { headers });
        if (!res.ok) {
          throw new Error(`Error fetching profile: ${res.statusText}`);
        }
        
        const data = await res.json();
        setProfile(data);

        // Fetch match history
        try {
          setLoadingHistory(true);
          const historyRes = await fetch(`${springBootBase()}/api/v1/arena/history`, { headers });
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            setMatchHistory(historyData);
          }
        } catch (historyErr) {
          console.error("Failed to fetch match history:", historyErr);
        } finally {
          setLoadingHistory(false);
        }

        // Fetch daily challenge
        try {
          const dailyRes = await fetch(`${springBootBase()}/api/v1/arena/daily-challenge`, { headers });
          if (dailyRes.ok) {
            const dailyData = await dailyRes.json();
            setDailyChallenge(dailyData);
          }
        } catch (dailyErr) {
          console.error("Failed to fetch daily challenge:", dailyErr);
        }

      } catch (err) {
        console.error("Failed to fetch arena profile:", err);
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoadingLeaderboard(true);
        // Leaderboard might be public, but let's send token if we have it
        const headers = {
          "Content-Type": "application/json",
        };
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${springBootBase()}/api/v1/arena/leaderboard`, { headers });
        if (!res.ok) {
          throw new Error(`Error fetching leaderboard: ${res.statusText}`);
        }
        
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        // Silently fail leaderboard so it doesn't break the page
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return { profile, leaderboard, matchHistory, dailyChallenge, loadingProfile, loadingLeaderboard, loadingHistory, error };
}
