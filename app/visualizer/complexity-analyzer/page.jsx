import ComplexityAnalyzerClient from "./ComplexityAnalyzerClient";

export const metadata = {
  title: "Complexity Analyzer | AlgoBuddy",
  description:
    "Interactive complexity analyzer for visualizing Big-O growth curves and comparing algorithm efficiency.",
};

export default function ComplexityAnalyzerPage() {
  return <ComplexityAnalyzerClient />;
}