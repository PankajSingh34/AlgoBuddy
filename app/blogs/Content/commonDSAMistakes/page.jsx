import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Content from "@/app/blogs/Content/commonDSAMistakes/content";

export const metadata = {
  title: "Common Mistakes Beginners Make While Learning DSA",
  description:
    "Discover the most common mistakes beginners make while learning Data Structures and Algorithms and learn practical strategies to improve problem-solving and coding skills.",
  keywords: [
    "DSA",
    "Data Structures",
    "Algorithms",
    "Beginner Programming",
    "Problem Solving",
    "Coding Mistakes",
    "Programming Tips",
    "Interview Preparation",
    "Learning DSA",
    "Computer Science"
  ],
  authors: [{ name: "Prakitesh Bakshi" }],
  openGraph: {
    title: "Common Mistakes Beginners Make While Learning DSA",
    description:
      "Avoid the most common beginner mistakes in DSA learning and build a stronger problem-solving mindset with practical guidance and examples.",
    url: "./blog/commonDSAMistakes.png",
    siteName: "DSA Visualizer",
    locale: "en_IN",
    type: "article",
    images: [
      {
        url: "./blog/commonDSAMistakes.png",
        width: 1200,
        height: 630,
        alt: "Common DSA Learning Mistakes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Common Mistakes Beginners Make While Learning DSA",
    description:
      "Learn the biggest mistakes beginners make while studying DSA and how to avoid them effectively.",
    images: ["./blog/commonDSAMistakes.png"],
  },
  category: "Data Structures & Algorithms",
  publishedTime: "2025-05-26T08:00:00Z",
  robots: "index, follow",
};

const page = () => {
  return(
    <main className="bg-white dark:bg-surface-950">
      <Navbar/>
      <Content/>
      <Footer/>
    </main>
  );
}

export default page;