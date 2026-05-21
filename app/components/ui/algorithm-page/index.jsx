import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbarinner";
import BackToTop from "@/app/components/ui/backtotop";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ExploreOther from "@/app/components/ui/exploreOther";
import ArticleActions from "@/app/components/ui/ArticleActions";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3",
        isCentered ? "items-center text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="rounded-full border border-[#e9d5ff] bg-[#faf5ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#a435f0] dark:border-[#3b1a6e] dark:bg-[#1a0a2e] dark:text-[#d8b4fe]">
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h2
          className={cn(
            "text-2xl font-black tracking-[-0.03em] text-[#1a1a1a] dark:text-white sm:text-3xl",
            isCentered && "mx-auto max-w-3xl"
          )}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={cn(
            "text-sm leading-7 text-[#6b7280] dark:text-[#9ca3af] sm:text-base",
            isCentered && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function BreadcrumbSection({ paths }) {
  return (
    <div className="mx-auto mb-6 w-full max-w-5xl">
      <Breadcrumbs paths={paths} />
    </div>
  );
}

export function AlgorithmHeader({
  category,
  title,
  description,
  showActions = true,
}) {
  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      {category ? (
        <p className="mx-auto mb-4 inline-flex rounded-full border border-[#e9d5ff] bg-[#faf5ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#a435f0] dark:border-[#3b1a6e] dark:bg-[#1a0a2e] dark:text-[#d8b4fe]">
          {category}
        </p>
      ) : null}

      <h1
        className="text-4xl font-black tracking-[-0.03em] text-[#1a1a1a] dark:text-white sm:text-5xl"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {title}
      </h1>

      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b7280] dark:text-[#9ca3af] sm:text-lg">
          {description}
        </p>
      ) : null}

      {showActions ? (
        <div className="mt-6 flex justify-center">
          <ArticleActions />
        </div>
      ) : null}

      <div className="mx-auto mt-10 h-px max-w-4xl bg-gradient-to-r from-transparent via-[#d1d7dc] to-transparent dark:via-[#333]" />
    </div>
  );
}

export function AlgorithmPageLayout({
  paths,
  category,
  title,
  description,
  showActions = true,
  children,
}) {
  return (
    <>
      <Navbar />

      <main className="bg-white pb-16 pt-6 text-[#1a1a1a] dark:bg-[#0f0f0f] dark:text-[#f5f5f5] sm:pt-8 lg:pt-10">
        <section className="container-app">
          <BreadcrumbSection paths={paths} />
          <AlgorithmHeader
            category={category}
            title={title}
            description={description}
            showActions={showActions}
          />
        </section>

        {children}
      </main>

      <BackToTop />
      <Footer />
    </>
  );
}

export function ExplanationCard({
  title,
  eyebrow,
  description,
  children,
  className,
}) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#222] dark:bg-[#111] sm:p-8",
        className
      )}
    >
      {(title || description || eyebrow) && (
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
        />
      )}
      {children}
    </article>
  );
}

export function VisualizerContainer({
  title,
  description,
  children,
  className,
  contentClassName,
  maxWidth = "max-w-5xl",
}) {
  return (
    <section className="container-app mt-10 sm:mt-12">
      <div className={cn("mx-auto w-full", maxWidth, className)}>
        {title || description ? (
          <SectionHeading
            eyebrow="Visualizer"
            title={title}
            description={description}
          />
        ) : null}

        <div
          className={cn(
            "rounded-[28px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-6 shadow-sm dark:border-[#222] dark:bg-[#111] sm:px-6 sm:py-8",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function ContentSection({
  children,
  className,
  maxWidth = "max-w-4xl",
}) {
  return (
    <section className="container-app mt-10 sm:mt-12">
      <div className={cn("mx-auto w-full", maxWidth, className)}>{children}</div>
    </section>
  );
}

export function CodeImplementationSection({
  title = "Implementation",
  description = "Review the algorithm in multiple programming languages without changing the underlying logic.",
  children,
  className,
}) {
  return (
    <section className="container-app mt-10 sm:mt-12">
      <div className={cn("mx-auto w-full max-w-4xl", className)}>
        <SectionHeading
          eyebrow="Code"
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}

export function ComplexitySection({
  title = "Complexity",
  description,
  items,
  className,
}) {
  return (
    <ExplanationCard
      title={title}
      description={description}
      className={cn("h-full", className)}
    >
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-[#ede9fe] bg-[#faf5ff] px-4 py-3 text-sm dark:border-[#3b1a6e] dark:bg-[#1a0a2e]"
          >
            <span className="text-[#6b7280] dark:text-[#c4b5fd]">{item.label}</span>
            <span className="font-semibold text-[#1a1a1a] dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </ExplanationCard>
  );
}

export function QuizChallengeSection({
  title = "Quiz Challenge",
  description = "Test your understanding before moving on to the next topic.",
  children,
  className,
}) {
  return (
    <section className="container-app mt-10 sm:mt-12">
      <div className={cn("mx-auto w-full max-w-4xl", className)}>
        <SectionHeading
          eyebrow="Challenge"
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}

export function RelatedTopicsSection({
  title,
  links,
  columns,
  className,
}) {
  return (
    <section className="container-app mt-10 sm:mt-12">
      <div className={cn("mx-auto w-full max-w-4xl", className)}>
        <ExploreOther title={title} links={links} columns={columns} />
      </div>
    </section>
  );
}

export function StandardAlgorithmPage({
  paths,
  category,
  title,
  description,
  content,
  visualizer,
  visualizerTitle,
  visualizerDescription,
  code,
  codeTitle,
  codeDescription,
  quiz,
  quizTitle,
  quizDescription,
  moduleCard,
  relatedTopics,
  showActions = true,
}) {
  return (
    <AlgorithmPageLayout
      paths={paths}
      category={category}
      title={title}
      description={description}
      showActions={showActions}
    >
      {visualizer ? (
        <VisualizerContainer
          title={visualizerTitle}
          description={visualizerDescription}
        >
          {visualizer}
        </VisualizerContainer>
      ) : null}

      {content ? <ContentSection>{content}</ContentSection> : null}

      {code ? (
        <CodeImplementationSection
          title={codeTitle}
          description={codeDescription}
        >
          {code}
        </CodeImplementationSection>
      ) : null}

      {quiz ? (
        <QuizChallengeSection
          title={quizTitle}
          description={quizDescription}
        >
          {quiz}
        </QuizChallengeSection>
      ) : null}

      {moduleCard ? <ContentSection>{moduleCard}</ContentSection> : null}

      {relatedTopics ? (
        <RelatedTopicsSection
          title={relatedTopics.title}
          links={relatedTopics.links}
          columns={relatedTopics.columns}
        />
      ) : null}
    </AlgorithmPageLayout>
  );
}
