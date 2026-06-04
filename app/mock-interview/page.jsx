"use client";

import { useMockInterviewWizard } from "@/hooks/useMockInterviewWizard";
import {
  SetupScreen,
  ActiveScreen,
  ReviewScreen,
  ResultsScreen,
} from "@/app/components/mock-interview";

export default function MockInterviewPage() {
  const wizard = useMockInterviewWizard();

  return (
    <main className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      {wizard.screen === "setup" && <SetupScreen wizard={wizard} />}
      {wizard.screen === "active" && <ActiveScreen wizard={wizard} />}
      {wizard.screen === "review" && <ReviewScreen wizard={wizard} />}
      {wizard.screen === "results" && <ResultsScreen wizard={wizard} />}
    </main>
  );
}