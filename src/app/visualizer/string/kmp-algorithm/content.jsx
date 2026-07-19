"use client";

export default function Content() {
  return (
    <div className="space-y-8">

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Knuth-Morris-Pratt (KMP) Algorithm
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          The Knuth-Morris-Pratt (KMP) Algorithm is an efficient string
          pattern matching algorithm. Unlike the naive approach, KMP avoids
          unnecessary comparisons by preprocessing the pattern and creating
          an LPS (Longest Prefix Suffix) array. This allows the algorithm
          to skip characters instead of restarting comparisons from the
          beginning.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          How KMP Works
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Preprocess the pattern to build the LPS array.</li>
          <li>Compare characters of the text and pattern.</li>
          <li>If characters match, move both pointers.</li>
          <li>If mismatch occurs, use the LPS array to skip comparisons.</li>
          <li>Repeat until the entire text is scanned.</li>
        </ol>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Example
        </h2>

        <div className="rounded-xl border p-5 bg-gray-50 dark:bg-[#222]">
          <p>
            <strong>Text:</strong> ABABDABACDABABCABAB
          </p>

          <p className="mt-2">
            <strong>Pattern:</strong> ABABCABAB
          </p>

          <p className="mt-4">
            KMP preprocesses the pattern, builds the LPS array, and finds the
            pattern without rechecking previously matched characters.
          </p>
        </div>
      </section>

      {/* Time Complexity */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Time Complexity
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border">

            <thead className="bg-violet-600 text-white">
              <tr>
                <th className="border px-4 py-3">Case</th>
                <th className="border px-4 py-3">Complexity</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td className="border px-4 py-3">Best</td>
                <td className="border px-4 py-3">O(n + m)</td>
              </tr>

              <tr>
                <td className="border px-4 py-3">Average</td>
                <td className="border px-4 py-3">O(n + m)</td>
              </tr>

              <tr>
                <td className="border px-4 py-3">Worst</td>
                <td className="border px-4 py-3">O(n + m)</td>
              </tr>

            </tbody>

          </table>
        </div>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Here,
          <br />
          <strong>n</strong> = Length of the text
          <br />
          <strong>m</strong> = Length of the pattern
        </p>
      </section>

      {/* Space Complexity */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Space Complexity
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          The auxiliary space required is <strong>O(m)</strong> because the
          algorithm stores the LPS array for the pattern.
        </p>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Advantages
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Avoids unnecessary comparisons.</li>
          <li>Linear time complexity.</li>
          <li>Efficient for large text searching.</li>
          <li>Widely used in search engines and text editors.</li>
          <li>Works well for repeated pattern matching.</li>
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Text editors (Find & Replace).</li>
          <li>DNA sequence matching.</li>
          <li>Search engines.</li>
          <li>Plagiarism detection.</li>
          <li>Compiler pattern matching.</li>
          <li>Bioinformatics.</li>
        </ul>
      </section>

    </div>
  );
}