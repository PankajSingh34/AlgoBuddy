const fs = require('fs');
const path = require('path');

function getAllQuizFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllQuizFiles(filePath, fileList);
    } else if (file === 'quiz.jsx') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const quizFiles = getAllQuizFiles(path.join(__dirname, 'app', 'visualizer'));

let successCount = 0;
let failCount = 0;

quizFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip already migrated
  if (content.includes('QuizEngine')) {
    return; // Already migrated
  }

  // Extract the title
  let titleMatch = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  let title = "Quiz Challenge";
  if (titleMatch) {
    title = titleMatch[1].replace(/<[^>]+>/g, '').replace(/[\{\}]/g, '').trim();
  }

  // Extract the component name
  const compMatch = content.match(/const ([A-Za-z0-9_]+)\s*=\s*\(\)\s*=>/);
  let componentName = compMatch ? compMatch[1] : "Quiz";

  let fixedQuestionsString = null;
  let hasJsonImport = false;
  let importStatement = "";

  // Strategy 1: Check for JSON import
  const importMatch = content.match(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+\.json)['"]/);
  if (importMatch) {
    const importVarName = importMatch[1];
    const importPath = importMatch[2];
    importStatement = `import ${importVarName} from "${importPath}";`;
    
    // We need to read the JSON file to fix legacy "answer" to "correctAnswer" index
    let absJsonPath = path.resolve(path.dirname(file), importPath.replace('@/app', './app').replace('@', '.'));
    
    // Since some paths might use @/app, let's resolve it carefully
    if (importPath.startsWith('@/')) {
        absJsonPath = path.join(__dirname, importPath.replace('@/', ''));
    }

    try {
        const jsonContent = fs.readFileSync(absJsonPath, 'utf8');
        let parsedQuestions = JSON.parse(jsonContent);
        
        parsedQuestions = parsedQuestions.map(q => {
          if (q.answer !== undefined && q.correctAnswer === undefined) {
            const idx = q.options.indexOf(q.answer);
            return {
              question: q.question,
              options: q.options,
              correctAnswer: idx >= 0 ? idx : 0,
              explanation: q.explanation || ""
            };
          }
          return q;
        });

        fixedQuestionsString = JSON.stringify(parsedQuestions, null, 2);
        // We will just inline the questions to remove the need for the JSON import
        hasJsonImport = true; 
    } catch(err) {
        console.error(`Failed to read JSON file ${absJsonPath} for ${file}`);
    }
  }

  // Strategy 2: Inline array
  if (!fixedQuestionsString) {
    const startIdx = content.indexOf('const questions = [');
    if (startIdx === -1) {
      console.error(`Failed to find questions array: ${file}`);
      failCount++;
      return;
    }
    
    let arrayString = "";
    let openBrackets = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = startIdx + "const questions = ".length; i < content.length; i++) {
      const char = content[i];
      arrayString += char;

      if (!inString) {
        if (char === "'" || char === '"' || char === '\`') {
          inString = true;
          stringChar = char;
        } else if (char === '[') {
          openBrackets++;
        } else if (char === ']') {
          openBrackets--;
          if (openBrackets === 0) {
            break;
          }
        }
      } else {
        if (char === stringChar && content[i - 1] !== '\\') {
          inString = false;
        }
      }
    }

    try {
      let parsedQuestions = eval("(" + arrayString + ")");
      parsedQuestions = parsedQuestions.map(q => {
        if (q.answer !== undefined && q.correctAnswer === undefined) {
          const idx = q.options.indexOf(q.answer);
          return {
            question: q.question,
            options: q.options,
            correctAnswer: idx >= 0 ? idx : 0,
            explanation: q.explanation || ""
          };
        }
        return q;
      });

      fixedQuestionsString = JSON.stringify(parsedQuestions, null, 2);
    } catch (err) {
      console.error(`Failed to parse/eval array for ${file}:`, err.message);
      failCount++;
      return;
    }
  }

  if (fixedQuestionsString) {
    const newContent = `"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ${componentName} = () => {
  const questions = ${fixedQuestionsString};

  return <QuizEngine title="${title}" questions={questions} />;
};

export default ${componentName};
`;

    fs.writeFileSync(file, newContent, 'utf8');
    
    // If it had a JSON import, we can safely delete the JSON file if it exists, or just leave it.
    // Leaving it is safer.
    console.log(`Migrated: ${file}`);
    successCount++;
  }
});

console.log(`\nMigration Complete. Success: ${successCount}, Failed: ${failCount}`);
