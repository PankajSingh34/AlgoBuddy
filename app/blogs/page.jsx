import BlogPage from "@/app/blogs/blogPage";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { PageWrapper } from "@/app/components/ui/PageWrapper";

export const metadata = {
  title: 'DSA Blogs & Guides | Learn Data Structures and Algorithms Effectively',
  description:
    'Explore beginner-friendly blogs on Data Structures and Algorithms (DSA) covering Python, Java, C++, Web Development, Machine Learning, and more.',
  robots: "index, follow",
};

const page = () => {
  return (
    <>
      <Navbar/>
      <PageWrapper>
        <BlogPage/>
      </PageWrapper>
      <Footer/>
    </>
  );
};

export default page;
