"use client";
import React from "react";
import CodeBlock from "@/components/ui/CodeBlock";

interface SharedCodeBlockProps {
  title: string;
  codeExamples: Record<string, string>;
  color?: string;
}

const SharedCodeBlock: React.FC<SharedCodeBlockProps> = ({
  title,
  codeExamples,
}) => {
  return (
    <div className="mt-8 mb-8">
      <CodeBlock
        title={title}
        codeExamples={codeExamples}
        variant="macos"
      />
    </div>
  );
};

export default SharedCodeBlock;
