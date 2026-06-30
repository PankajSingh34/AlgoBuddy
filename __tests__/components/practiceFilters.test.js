import { filterPracticeProblems } from "@/app/practice/problemFilters";

describe("filterPracticeProblems", () => {
  const problems = [
    { id: "1", name: "Binary Search", topic: "Searching", difficulty: "Easy", companies: ["Google"] },
    { id: "2", name: "Merge Sort", topic: "Sorting", difficulty: "Medium", companies: ["Meta"] },
    { id: "3", name: "Dijkstra", topic: "Graphs", difficulty: "Hard", companies: ["Amazon"] },
  ];

  it("filters problems by difficulty alongside the existing search and topic filters", () => {
    const result = filterPracticeProblems({
      allProblems: problems,
      searchQuery: "",
      selectedTopic: "All Topics",
      selectedDifficulty: "Medium",
      selectedCompanyFilter: "All",
      activeView: "problem-list",
      bookmarks: [],
      progress: {},
      getStatus: () => "Not Started",
      isBookmarked: () => false,
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Merge Sort");
  });

  it("keeps bookmark and recent-solved views working with difficulty filtering", () => {
    const bookmarked = filterPracticeProblems({
      allProblems: problems,
      searchQuery: "",
      selectedTopic: "All Topics",
      selectedDifficulty: "Easy",
      selectedCompanyFilter: "All",
      activeView: "bookmarks",
      bookmarks: [{ id: "1", createdAt: "2026-06-30T00:00:00Z" }],
      progress: {},
      getStatus: () => "Not Started",
      isBookmarked: (id) => id === "1",
    });

    expect(bookmarked).toHaveLength(1);
    expect(bookmarked[0].id).toBe("1");

    const recentSolved = filterPracticeProblems({
      allProblems: problems,
      searchQuery: "",
      selectedTopic: "All Topics",
      selectedDifficulty: "Hard",
      selectedCompanyFilter: "All",
      activeView: "recent-solved",
      bookmarks: [],
      progress: { "3": { updatedAt: "2026-06-30T08:00:00Z" } },
      getStatus: (id) => (id === "3" ? "Completed" : "Not Started"),
      isBookmarked: () => false,
    });

    expect(recentSolved).toHaveLength(1);
    expect(recentSolved[0].id).toBe("3");
  });
});
