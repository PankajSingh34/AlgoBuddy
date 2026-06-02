export default function LastUpdated({ date }) {
  const parsedDate = (() => {
    if (!date) {
      return new Date();
    }

    const candidate = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return Number.isNaN(candidate?.getTime?.()) ? new Date() : candidate;
  })();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);

  return (
    <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
      🗓️ Last updated: {formattedDate}
    </p>
  );
}
