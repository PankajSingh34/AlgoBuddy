"use client";

export default function Content() {
  return (
    <div className="space-y-8">

      <section>
        <h2 className="text-3xl font-bold mb-4">
          Rabin-Karp Algorithm
        </h2>

        <p className="text-surface-700 dark:text-surface-300 leading-8">
          Rabin-Karp is an efficient string searching algorithm that uses a
          rolling hash technique to find a pattern inside a text. Instead of
          comparing every character one by one, it computes hash values for the
          pattern and each substring of the text. Character-by-character
          comparison is performed only when the hash values match, making it
          efficient for searching multiple patterns.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Working Principle
        </h3>

        <ol className="list-decimal ml-6 space-y-2 text-surface-700 dark:text-surface-300">
          <li>Compute the hash value of the pattern.</li>
          <li>Compute the hash value of the first window of the text.</li>
          <li>Compare both hash values.</li>
          <li>
            If hashes match, compare characters one by one to verify the match.
          </li>
          <li>
            Slide the window by one character and update the hash using the
            rolling hash technique.
          </li>
          <li>Repeat until the end of the text.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Example
        </h3>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-5 font-mono text-sm">
          <p>Text : ABABDABACDABABCABAB</p>
          <p>Pattern : ABABCABAB</p>
          <p>Result : Pattern found at index 10</p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Time Complexity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="border p-3 text-left">Case</th>
                <th className="border p-3 text-left">Complexity</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-3">Best Case</td>
                <td className="border p-3">O(n + m)</td>
              </tr>

              <tr>
                <td className="border p-3">Average Case</td>
                <td className="border p-3">O(n + m)</td>
              </tr>

              <tr>
                <td className="border p-3">Worst Case</td>
                <td className="border p-3">O(n × m)</td>
              </tr>

              <tr>
                <td className="border p-3">Space Complexity</td>
                <td className="border p-3">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Advantages
        </h3>

        <ul className="list-disc ml-6 space-y-2 text-surface-700 dark:text-surface-300">
          <li>Efficient for multiple pattern searching.</li>
          <li>Uses rolling hash to avoid recomputing hashes.</li>
          <li>Average-case performance is very fast.</li>
          <li>Simple implementation.</li>
          <li>Widely used in plagiarism detection.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Disadvantages
        </h3>

        <ul className="list-disc ml-6 space-y-2 text-surface-700 dark:text-surface-300">
          <li>Hash collisions may occur.</li>
          <li>Worst-case complexity becomes O(n × m).</li>
          <li>Requires a good hash function.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3">
          Applications
        </h3>

        <ul className="list-disc ml-6 space-y-2 text-surface-700 dark:text-surface-300">
          <li>Pattern matching.</li>
          <li>Plagiarism detection systems.</li>
          <li>DNA sequence matching.</li>
          <li>Virus signature detection.</li>
          <li>Search engines.</li>
          <li>Text editors.</li>
          <li>Bioinformatics.</li>
        </ul>
      </section>

    </div>
  );
}