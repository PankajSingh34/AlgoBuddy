"use client";
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@/features/user/UserContext";
import { persistence } from "@/lib/persistence";

function normalizeProgress(raw) {
  const map = {};
  Object.keys(raw).forEach((key) => {
    map[key] = typeof raw[key] === 'object' && raw[key] !== null
      ? (raw[key].status || 'Not Started')
      : (raw[key] || 'Not Started');
  });
  return map;
}

export function useProgress() {
  const { user } = useUser();
  const [rawProgress, setRawProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const progress = useMemo(() => normalizeProgress(rawProgress), [rawProgress]);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      const localRaw = await persistence.get('PRACTICE_PROGRESS') || {};

      if (user) {
        const serverProgress = await persistence.loadFromServer('user_progress', user.id);
        if (serverProgress && serverProgress.length > 0) {
          const serverMap = {};
          serverProgress.forEach((item) => {
            if (item.problem_id) {
              serverMap[item.problem_id] = { status: item.is_done ? 'Completed' : 'In Progress', updatedAt: item.updated_at };
            }
          });
          const merged = persistence.mergeProgress(localRaw, serverProgress, user.id);
          setRawProgress(merged);
          persistence.set('PRACTICE_PROGRESS', merged);
        } else {
          setRawProgress(localRaw);
        }
      } else {
        setRawProgress(localRaw);
      }
      setLoading(false);
    };

    loadProgress();
  }, [user]);

  const updateProgress = useCallback(async (problemId, status) => {
    const updatedAt = new Date().toISOString();
    const next = { ...rawProgress, [problemId]: { status, updatedAt } };
    setRawProgress(next);
    persistence.set('PRACTICE_PROGRESS', next);

    if (user) {
      await persistence.syncToServer(
        'user_progress',
        {
          user_id: user.id,
          problem_id: problemId,
          status,
          is_done: status === 'Completed',
          updated_at: updatedAt,
        },
        ['user_id', 'problem_id']
      );
    }
  }, [rawProgress, user]);

  return { progress, loading, updateProgress };
}
