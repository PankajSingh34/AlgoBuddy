export function filterPracticeProblems({
  allProblems,
  searchQuery = "",
  selectedTopic = "All Topics",
  selectedDifficulty = "All Difficulties",
  selectedCompanyFilter = "All",
  activeView = "problem-list",
  bookmarks = [],
  progress = {},
  getStatus = () => "Not Started",
  isBookmarked = () => false,
}) {
  let filtered = allProblems.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.topic.toLowerCase().includes(query);
    const matchesTopic = selectedTopic === "All Topics" || p.topic === selectedTopic;
    const matchesDifficulty =
      selectedDifficulty === "All Difficulties" || p.difficulty === selectedDifficulty;
    const matchesCompany =
      selectedCompanyFilter === "All" ||
      (p.companies && p.companies.some((c) => c.toLowerCase() === selectedCompanyFilter.toLowerCase()));

    if (activeView === "bookmarks") {
      return matchesSearch && matchesTopic && matchesDifficulty && matchesCompany && isBookmarked(p.id);
    }

    if (activeView === "recent-solved") {
      return matchesSearch && matchesTopic && matchesDifficulty && matchesCompany && getStatus(p.id) === "Completed";
    }

    return matchesSearch && matchesTopic && matchesDifficulty && matchesCompany;
  });

  if (activeView === "recent-solved") {
    filtered.sort((a, b) => {
      const timeA = progress[a.id]?.updatedAt ? new Date(progress[a.id].updatedAt).getTime() : 0;
      const timeB = progress[b.id]?.updatedAt ? new Date(progress[b.id].updatedAt).getTime() : 0;
      return timeB - timeA;
    });
  } else if (activeView === "bookmarks") {
    filtered.sort((a, b) => {
      const bA = bookmarks.find((x) => x.id === a.id);
      const bB = bookmarks.find((x) => x.id === b.id);
      const timeA = bA?.createdAt ? new Date(bA.createdAt).getTime() : 0;
      const timeB = bB?.createdAt ? new Date(bB.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  return filtered;
}
