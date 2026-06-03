import OnboardingTour from "./components/OnboardingTour";

export default function VisualizerLayout({ children }) {
  return (
    <>
      {children}
      <OnboardingTour />
    </>
  );
}
