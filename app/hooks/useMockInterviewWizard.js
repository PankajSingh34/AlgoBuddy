"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/app/components/UserContext";
import { pickProblems } from "@/lib/mockInterviewBank";

const SNAPSHOT_INTERVAL_MS = 30_000;

const DEFAULT_CONFIG = {
  algorithm: "arrays",
  difficulty: "medium",
  durationSecs: 1800,
  language: "javascript",
  problemCount: 1,
  allowHints: true,
  allowSkip: true,
};

function getOptimalCode(problem, language) {
  return (
    problem?.optimalSolutions?.[language] ||
    problem?.optimalSolutions?.javascript ||
    problem?.starterCode?.[language] ||
    problem?.starterCode?.javascript ||
    problem?.starterCode?.python ||
    "// Optimal reference solution will be added soon."
  );
}

function normalizeAttempt(attempt, index) {
  const visibleTotal = attempt?.visibleTestsTotal ?? 0;
  const visiblePassed = attempt?.visibleTestsPassed ?? 0;
  const perProblemScore =
    visibleTotal > 0 ? Math.round((visiblePassed / visibleTotal) * 100) : 0;

  return {
    ...attempt,
    index,
    perProblemScore,
  };
}

export function useMockInterviewWizard() {
  const { user } = useUser();

  const [screen, setScreen] = useState("setup");
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const [selectedProblems, setSelectedProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(config.durationSecs);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  const [testResults, setTestResults] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [score, setScore] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const snapshotRef = useRef(null);
  const elapsedRef = useRef(0);

  const totalProblems = selectedProblems.length;
  const currentProblemNumber = totalProblems === 0 ? 0 : currentProblemIndex + 1;
  const isLastProblem = totalProblems > 0 && currentProblemIndex === totalProblems - 1;

  const reviewItems = attempts.map((attempt, idx) => normalizeAttempt(attempt, idx));

  useEffect(() => {
    if (!timerActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        elapsedRef.current += 1;
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // handleTimeUp intentionally excluded because it depends on submitCode,
  // which would rebind this interval effect on every code change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive]);

  useEffect(() => {
    if (!timerActive || !sessionId) return;

    snapshotRef.current = setInterval(async () => {
      await supabase.from("mock_interview_code_snapshots").insert({
        session_id: sessionId,
        code,
        language: config.language,
        elapsed_secs: elapsedRef.current,
      });
    }, SNAPSHOT_INTERVAL_MS);

    return () => clearInterval(snapshotRef.current);
  }, [timerActive, sessionId, code, config.language]);

  const updateConfig = useCallback((patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      const nextCount = Math.max(1, Math.min(5, Number(next.problemCount) || 1));
      next.problemCount = nextCount;
      setSecondsLeft(next.durationSecs);
      return next;
    });
  }, []);

  const startInterview = useCallback(async () => {
    setError(null);
    setSubmitting(true);

    try {
      const targetCount = Math.max(1, Math.min(5, Number(config.problemCount) || 1));
      const picked = pickProblems({
        algorithm: config.algorithm,
        difficulty: config.difficulty,
        count: targetCount,
      });

      if (!picked.length) {
        throw new Error("No problems found for this algorithm and difficulty.");
      }

      setSelectedProblems(picked);
      setCurrentProblemIndex(0);
      setProblem(picked[0]);
      setCode(picked[0]?.starterCode?.[config.language] ?? "");
      setHintsUsed(0);
      setTestResults([]);
      setAttempts([]);
      setScore(null);
      setSecondsLeft(config.durationSecs);
      elapsedRef.current = 0;

      if (user) {
        const { data, error: dbErr } = await supabase
          .from("mock_interview_sessions")
          .insert({
            user_id: user.id,
            algorithm: config.algorithm,
            difficulty: config.difficulty,
            duration_secs: config.durationSecs,
            language: config.language,
            status: "active",
            started_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (dbErr) throw dbErr;
        setSessionId(data.id);
      }

      setScreen("active");
      setTimerActive(true);
    } catch (err) {
      setError(err.message ?? "Failed to start interview.");
    } finally {
      setSubmitting(false);
    }
  }, [config, user]);

  const submitCode = useCallback(async () => {
    if (!problem) return;

    setSubmitting(true);
    setError(null);

    try {
      const results = runTestCases(problem, code, config.language);
      setTestResults(results);

      const visibleTestsTotal = results.length;
      const visibleTestsPassed = results.filter((result) => result.passed).length;

      const attempt = {
        problemId: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        algorithm: problem.algorithm,
        visualizerSlug: problem.visualizerSlug,
        userCode: code,
        optimalCode: getOptimalCode(problem, config.language),
        testResults: results,
        visibleTestsTotal,
        visibleTestsPassed,
        hintsUsed,
      };

      const nextAttempts = [...attempts, attempt];
      setAttempts(nextAttempts);

      if (!isLastProblem) {
        const nextIndex = currentProblemIndex + 1;
        const nextProblem = selectedProblems[nextIndex];

        setCurrentProblemIndex(nextIndex);
        setProblem(nextProblem);
        setCode(nextProblem?.starterCode?.[config.language] ?? "");
        setHintsUsed(0);
        setTestResults([]);
        setSubmitting(false);
        return;
      }

      setTimerActive(false);
      clearInterval(timerRef.current);
      clearInterval(snapshotRef.current);

      const totalVisibleTests = nextAttempts.reduce(
        (sum, item) => sum + item.visibleTestsTotal,
        0,
      );
      const totalVisiblePassed = nextAttempts.reduce(
        (sum, item) => sum + item.visibleTestsPassed,
        0,
      );
      const computedScore =
        totalVisibleTests > 0
          ? Math.round((totalVisiblePassed / totalVisibleTests) * 100)
          : 0;

      setScore(computedScore);

      if (sessionId) {
        await supabase
          .from("mock_interview_sessions")
          .update({
            status: "review",
            final_code: nextAttempts
              .map(
                (item, idx) =>
                  `# Problem ${idx + 1}: ${item.title}\n${item.userCode || ""}`,
              )
              .join("\n\n"),
            test_results: nextAttempts,
            hints_used: nextAttempts.reduce((sum, item) => sum + item.hintsUsed, 0),
            score: computedScore,
            time_taken_secs: elapsedRef.current,
            ended_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      }

      setScreen("review");
    } catch (err) {
      setError(err.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }, [
    problem,
    code,
    config.language,
    hintsUsed,
    attempts,
    isLastProblem,
    currentProblemIndex,
    selectedProblems,
    sessionId,
  ]);

  const handleTimeUp = useCallback(() => {
    submitCode();
  }, [submitCode]);

  const finishReview = useCallback(async () => {
    if (sessionId) {
      await supabase
        .from("mock_interview_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId);
    }
    setScreen("results");
  }, [sessionId]);

  const retry = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(snapshotRef.current);

    setProblem(null);
    setSelectedProblems([]);
    setCurrentProblemIndex(0);
    setCode("");
    setTestResults([]);
    setHintsUsed(0);
    setAttempts([]);
    setScore(null);
    setSessionId(null);
    setError(null);
    setSubmitting(false);
    setTimerActive(false);
    setSecondsLeft(config.durationSecs);
    setScreen("setup");
  }, [config.durationSecs]);

  const useHint = useCallback(() => {
    if (!(config.allowHints ?? true)) return;
    setHintsUsed((count) => count + 1);
  }, [config.allowHints]);

  const abandon = useCallback(async () => {
    clearInterval(timerRef.current);
    clearInterval(snapshotRef.current);
    setTimerActive(false);

    if (sessionId) {
      await supabase
        .from("mock_interview_sessions")
        .update({ status: "abandoned", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    retry();
  }, [sessionId, retry]);

  return {
    screen,
    config,
    updateConfig,

    problem,
    code,
    setCode,

    secondsLeft,
    timerActive,
    hintsUsed,
    testResults,
    score,
    submitting,
    error,

    selectedProblems,
    currentProblemIndex,
    currentProblemNumber,
    totalProblems,
    isLastProblem,
    reviewItems,

    startInterview,
    submitCode,
    finishReview,
    useHint,
    retry,
    abandon,
  };
}

function runTestCases(problem, code, language) {
  if (!problem?.testCases?.length) return [];

  return problem.testCases
    .filter((testCase) => !testCase.isHidden)
    .map((testCase) => {
      const start = performance.now();
      let passed = false;
      let output = "";

      if (language === "javascript") {
        try {
          const fn = new Function(`${code}\nreturn typeof solution !== 'undefined' ? solution : null;`)();
          if (typeof fn === "function") {
            const result = fn(...(testCase.inputArgs ?? []));
            output = JSON.stringify(result);
            passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
          }
        } catch (error) {
          output = `Error: ${error.message}`;
        }
      } else {
        output = "Server-side evaluation pending";
      }

      return {
        caseId: testCase.id,
        passed,
        output,
        runtimeMs: Math.round(performance.now() - start),
      };
    });
}
