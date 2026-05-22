"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const graph = {
	nodes: [
		{ id: "A", x: 120, y: 110 },
		{ id: "B", x: 260, y: 70 },
		{ id: "C", x: 260, y: 250 },
		{ id: "D", x: 430, y: 50 },
		{ id: "E", x: 430, y: 170 },
		{ id: "F", x: 590, y: 260 },
	],
	edges: [
		["A", "B"],
		["A", "C"],
		["B", "D"],
		["B", "E"],
		["C", "E"],
		["C", "F"],
		["D", "E"],
		["E", "F"],
	],
	adjacency: {
		A: ["B", "C"],
		B: ["A", "D", "E"],
		C: ["A", "E", "F"],
		D: ["B", "E"],
		E: ["B", "C", "D", "F"],
		F: ["C", "E"],
	},
};

const defaultStartNode = graph.nodes[0].id;

function normalizeNode(value) {
	return value.trim().toUpperCase();
}

function isValidNode(value) {
	return graph.nodes.some((node) => node.id === value);
}

function buildBfsTrace(startNode) {
	const visited = new Set([startNode]);
	const queue = [startNode];
	const order = [];
	const queueSnapshots = [];

	while (queue.length > 0) {
		queueSnapshots.push([...queue]);
		const current = queue.shift();
		order.push(current);

		for (const neighbor of graph.adjacency[current]) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return { order, queueSnapshots };
}

export default function GraphAnimation({ type, title, startNode }) {
	const nodeRefs = useRef({});
	const timelineRef = useRef(null);

	const initialStartNode = useMemo(() => {
		const candidate = typeof startNode === "string" ? normalizeNode(startNode) : defaultStartNode;
		return isValidNode(candidate) ? candidate : defaultStartNode;
	}, [startNode]);

	const [activeSource, setActiveSource] = useState(initialStartNode);
	const [activeIndex, setActiveIndex] = useState(0);

	const { order, queueSnapshots } = useMemo(() => buildBfsTrace(activeSource), [activeSource]);

	useEffect(() => {
		setActiveSource(initialStartNode);
		setActiveIndex(0);
	}, [initialStartNode]);

	useEffect(() => {
		if (type !== "bfs") {
			return undefined;
		}

		timelineRef.current?.kill();

		Object.values(nodeRefs.current).forEach((node) => {
			if (node) {
				gsap.set(node, { scale: 1, transformOrigin: "50% 50%" });
			}
		});

		setActiveIndex(0);

		const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

		order.forEach((nodeId, index) => {
			timeline.call(() => {
				setActiveIndex(index);
			});

			timeline.to(nodeRefs.current[nodeId], {
				duration: 0.24,
				scale: 1.14,
				transformOrigin: "50% 50%",
			});

			timeline.to(nodeRefs.current[nodeId], {
				duration: 0.24,
				scale: 1,
				transformOrigin: "50% 50%",
			});
		});

		timelineRef.current = timeline;

		return () => {
			timeline.kill();
		};
	}, [activeSource, order, type]);

	const visitedNodes = order.slice(0, activeIndex + 1);
	const currentNode = order[activeIndex] || activeSource;
	const currentQueue = queueSnapshots[activeIndex] || [activeSource];

	const resetTraversal = () => {
		setActiveIndex(0);
		setActiveSource(defaultStartNode);
	};

	if (type !== "bfs") {
		return (
			<section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card dark:border-surface-800 dark:bg-surface-900">
				<div className="space-y-3">
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
						Graph animation
					</p>
					<h3 className="text-2xl font-bold">{title}</h3>
					<p className="max-w-2xl text-sm leading-6 text-surface-600 dark:text-surface-400">
						The shared graph animation shell is focused on BFS for now. This keeps the
						traversal controls, validation, and highlight logic aligned with the source-vertex
						selector requested for Breadth-First Search.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card dark:border-surface-800 dark:bg-surface-900">
			<div className="border-b border-surface-100 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 px-6 py-5 dark:border-surface-800">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-2">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
							Interactive BFS run
						</p>
						<h3 className="text-2xl font-bold">{title}</h3>
						<p className="text-sm leading-6 text-surface-600 dark:text-surface-400">
							Choose a source vertex to rerun BFS and see how the visitation order changes with
							the selected starting point.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<label className="flex flex-col gap-1 text-sm font-medium text-surface-700 dark:text-surface-300">
							<span>Source vertex</span>
							<select
								value={activeSource}
								onChange={(event) => setActiveSource(event.target.value)}
								className="rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-surface-700 dark:bg-surface-950"
							>
								{graph.nodes.map((node) => (
									<option key={node.id} value={node.id}>
										{node.id}
									</option>
								))}
							</select>
						</label>

						<button
							type="button"
							onClick={resetTraversal}
							className="h-11 rounded-xl border border-surface-200 px-4 text-sm font-semibold text-surface-700 transition hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-300"
						>
							Reset
						</button>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
					<span className="rounded-full border border-surface-200 px-3 py-1 dark:border-surface-700">
						Valid nodes: {graph.nodes.map((node) => node.id).join(", ")}
					</span>
					<span className="rounded-full border border-surface-200 px-3 py-1 dark:border-surface-700">
						Traversal source: {activeSource}
					</span>
					<span className="rounded-full border border-surface-200 px-3 py-1 dark:border-surface-700">
						Current node: {currentNode}
					</span>
				</div>

			</div>

			<div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.85fr]">
				<div className="rounded-3xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-surface-100 p-4 dark:border-surface-800 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950">
					<svg viewBox="0 0 720 380" className="h-[360px] w-full" role="img" aria-label="BFS graph visualization">
						<defs>
							<linearGradient id="bfs-edge" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="rgba(79, 70, 229, 0.35)" />
								<stop offset="100%" stopColor="rgba(14, 165, 233, 0.35)" />
							</linearGradient>
							<linearGradient id="bfs-active-edge" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="rgba(79, 70, 229, 0.95)" />
								<stop offset="100%" stopColor="rgba(14, 165, 233, 0.95)" />
							</linearGradient>
						</defs>

						{graph.edges.map(([from, to]) => {
							const fromNode = graph.nodes.find((node) => node.id === from);
							const toNode = graph.nodes.find((node) => node.id === to);
							const edgeVisited = visitedNodes.includes(from) && visitedNodes.includes(to);
							const edgeActive = currentNode && ((from === currentNode && visitedNodes.includes(to)) || (to === currentNode && visitedNodes.includes(from)));

							return (
								<line
									key={`${from}-${to}`}
									x1={fromNode.x}
									y1={fromNode.y}
									x2={toNode.x}
									y2={toNode.y}
									stroke={edgeActive ? "url(#bfs-active-edge)" : edgeVisited ? "rgba(79, 70, 229, 0.75)" : "url(#bfs-edge)"}
									strokeWidth={edgeActive ? 5 : 3}
									strokeLinecap="round"
								/>
							);
						})}

						{graph.nodes.map((node) => {
							const isVisited = visitedNodes.includes(node.id);
							const isCurrent = currentNode === node.id;

							return (
								<g key={node.id}>
									<circle
										ref={(element) => {
											nodeRefs.current[node.id] = element;
										}}
										cx={node.x}
										cy={node.y}
										r="28"
										className={[
											"transition-colors duration-300",
											isCurrent
												? "fill-primary text-white shadow-[0_0_0_10px_rgba(79,70,229,0.14)]"
												: isVisited
												? "fill-secondary text-white"
												: "fill-white text-surface-800 dark:fill-surface-950 dark:text-white",
										].join(" ")}
										stroke={isCurrent ? "rgba(79,70,229,0.9)" : isVisited ? "rgba(14,165,233,0.8)" : "rgba(148,163,184,0.8)"}
										strokeWidth="3"
										style={{ transformBox: "fill-box", transformOrigin: "center" }}
									/>
									<text
										x={node.x}
										y={node.y + 6}
										textAnchor="middle"
										className={[
											"pointer-events-none select-none text-base font-bold",
											isCurrent || isVisited ? "fill-white" : "fill-surface-700 dark:fill-surface-300",
										].join(" ")}
									>
										{node.id}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				<div className="space-y-4">
					<div className="rounded-3xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-800 dark:bg-surface-950/70">
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Traversal state</p>
						<div className="mt-4 grid gap-3 text-sm text-surface-700 dark:text-surface-300">
							<div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-surface-900">
								<span>Source</span>
								<span className="font-semibold text-surface-900 dark:text-white">{activeSource}</span>
							</div>
							<div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-surface-900">
								<span>Current node</span>
								<span className="font-semibold text-surface-900 dark:text-white">{currentNode}</span>
							</div>
							<div className="rounded-2xl bg-white px-4 py-3 dark:bg-surface-900">
								<div className="mb-2 flex items-center justify-between">
									<span>Queue snapshot</span>
									<span className="text-xs text-surface-500 dark:text-surface-400">BFS frontier</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{currentQueue.map((node) => (
										<span key={`${node}-${currentNode}`} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
											{node}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-3xl border border-surface-200 bg-surface-50 p-5 dark:border-surface-800 dark:bg-surface-950/70">
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Visited order</p>
						<div className="mt-4 flex flex-wrap gap-2">
							{order.map((node, index) => {
								const isActive = index === activeIndex;
								const isDone = index < activeIndex;

								return (
									<span
										key={`${node}-${index}`}
										className={[
											"rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
											isActive
												? "border-primary bg-primary text-white"
												: isDone
												? "border-secondary bg-secondary/10 text-secondary"
												: "border-surface-200 bg-white text-surface-600 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400",
										].join(" ")}
									>
										{node}
									</span>
								);
							})}
						</div>
					</div>

					<div className="rounded-3xl border border-surface-200 bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-5 text-sm text-surface-600 dark:border-surface-800 dark:from-primary/10 dark:via-surface-950 dark:to-secondary/10 dark:text-surface-300">
						<p className="font-semibold text-surface-900 dark:text-white">Why the source matters</p>
						<p className="mt-2 leading-6">
							BFS expands vertices by distance from the chosen start vertex, so the first vertex you
							choose changes the entire discovery order. The same graph can produce different layer
							expansions depending on the source.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
