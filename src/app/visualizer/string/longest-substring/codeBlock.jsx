"use client";

import { useState } from "react";

const code = {
  cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

// Your C++ code here
`,

  java: `import java.util.*;

// Your Java code here
`,

  python: `# Your Python code here
`,

  javascript: `// Your JavaScript code here
`,
};

export default function CodeBlock() {
  const [language, setLanguage] = useState("cpp");

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gray-800 px-5 py-3 flex justify-between items-center">
        <h2 className="text-white font-semibold">
          {language.toUpperCase()} Code
        </h2>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <pre className="overflow-x-auto p-6 text-green-400 text-sm leading-7">
        <code>{code[language]}</code>
      </pre>
    </div>
  );
}