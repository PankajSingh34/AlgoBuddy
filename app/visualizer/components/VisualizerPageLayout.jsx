import VisualizerPageLayoutClient from "./VisualizerPageLayoutClient";

export function createVisualizerPaths(...segments) {
  return [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    ...segments.map((name) => ({
      name,
    })),
  ];
}

export default function VisualizerPageLayout(props) {
  return <VisualizerPageLayoutClient {...props} />;
}

