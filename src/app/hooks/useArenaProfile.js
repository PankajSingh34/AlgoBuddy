import { useState, useEffect } from 'react';
import { api } from "@/lib/apiClient";

function springBootBase() {
  if (process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL) {
    return process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL;
  }
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.")
    ) {
      return `http://${window.location.hostname}:8080`;
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
        const data = await api.request("/api/v1/arena/profile", {
          baseUrl: springBootBase(),
        });
        setProfile(data);

        // Fetch match history
        try {
          setLoadingHistory(true);
          const historyData = await api.request("/api/v1/arena/history", {
            baseUrl: springBootBase(),
            silent: true,
          });
          setMatchHistory(historyData);
        } catch (historyErr) {
          console.warn("Failed to fetch match history:", historyErr.message);
        } finally {
          setLoadingHistory(false);
        }

        // Fetch daily challenge
        try {
          const dailyData = await api.request("/api/v1/arena/daily-challenge", {
            baseUrl: springBootBase(),
            silent: true,
          });
          setDailyChallenge(dailyData);
        } catch (dailyErr) {
          console.warn("Failed to fetch daily challenge:", dailyErr.message);
        }

      } catch (err) {
        console.warn("Failed to fetch arena profile:", err.message);
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
        const data = await api.request("/api/v1/arena/leaderboard", {
          baseUrl: springBootBase(),
          silent: true,
        });
        setLeaderboard(data);
      } catch (err) {
        console.warn("Failed to fetch leaderboard:", err.message);
        // Silently fail leaderboard so it doesn't break the page
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return { profile, leaderboard, matchHistory, dailyChallenge, loadingProfile, loadingLeaderboard, loadingHistory, error };
}
