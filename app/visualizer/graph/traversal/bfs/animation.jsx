"use client";

import GraphAnimation from "@/app/visualizer/graph/components/GraphAnimation";
import { graphTopics } from "@/app/visualizer/graph/data";

export default function Animation({ startNode }) {
  return (
    <GraphAnimation
      type={graphTopics.bfs.animationType}
      title={graphTopics.bfs.title}
      startNode={startNode}
    />
  );
}
