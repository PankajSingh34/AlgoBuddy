import DashboardClient from "./DashboardClient";
import AIStudySchedule from "@/app/components/AIStudySchedule";

export const metadata = {
  title: "Dashboard | AlgoBuddy",
  description:
    "Access bookmarked visualizers, algorithms, and practice resources from one place.",
};

export default function DashboardPage() {
  return (
  <>
    <DashboardClient />
    <AIStudySchedule />
  </>
);
}
