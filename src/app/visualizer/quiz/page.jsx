import AlgorithmQuiz from "@/app/components/AlgorithmQuiz";
import QuizErrorBoundary from "@/app/components/ui/QuizErrorBoundary";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-6">
      <QuizErrorBoundary>
        <AlgorithmQuiz />
      </QuizErrorBoundary>
    </div>
  );
}