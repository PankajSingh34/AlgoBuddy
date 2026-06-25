import CallStackVisualizer from "./components/CallStackVisualizer";

export const metadata = {
  title: "Call Stack Visualizer | AlgoBuddy",
  description: "Visualize recursive call stack for Factorial algorithm",
};

export default function CallStackPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          Call Stack Memory Visualizer
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Watch how recursive calls pile up and unwind on the call stack
        </p>
        <CallStackVisualizer />
      </div>
    </main>
  );
}