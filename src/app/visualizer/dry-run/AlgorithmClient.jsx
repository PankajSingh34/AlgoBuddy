import Footer from "@/app/components/footer";
import DryRunClient from "./DryRunClient";



export default function DryRunPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#101216] dark:text-slate-100">
      <DryRunClient />
      <Footer />
    </div>
  );
}

