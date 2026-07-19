export default function Content() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Overview</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-7">
          The <strong>Z Algorithm</strong> is a linear-time string matching
          algorithm used to efficiently find all occurrences of a pattern
          within a text. It constructs a <strong>Z-array</strong>, where each
          element represents the length of the longest substring starting from
          that position that matches the prefix of the string. By combining the
          pattern and text into a single string, the algorithm can locate every
          pattern occurrence in <strong>O(n + m)</strong> time.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-2xl font-bold mb-3">How It Works</h2>

        <ol className="list-decimal ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Concatenate the pattern, a special separator ($), and the text.</li>
          <li>Construct the Z-array for the combined string.</li>
          <li>Maintain a Z-box using two pointers (Left and Right).</li>
          <li>Reuse previously computed values whenever possible.</li>
          <li>Extend matches beyond the current Z-box if needed.</li>
          <li>Whenever a Z-value equals the pattern length, a match is found.</li>
        </ol>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Example</h2>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-5">
          <p>
            <strong>Text:</strong> aabcaabxaaaz
          </p>

          <p>
            <strong>Pattern:</strong> aabx
          </p>

          <p className="mt-3">
            Combined String:
          </p>

          <code className="block mt-2 rounded bg-white dark:bg-slate-900 p-3">
            aabx$aabcaabxaaaz
          </code>

          <p className="mt-3">
            After computing the Z-array, a value equal to the pattern length
            (4) indicates that the pattern starts at that position in the text.
          </p>
        </div>
      </section>

      {/* Complexity */}
      <section>
        <h2 className="text-2xl font-bold mb-3">
          Time & Space Complexity
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="border p-3 text-left">Operation</th>
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
                <td className="border p-3">O(n + m)</td>
              </tr>

              <tr>
                <td className="border p-3">Space Complexity</td>
                <td className="border p-3">O(n + m)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Advantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Linear time complexity.</li>
          <li>Efficient for large text searching.</li>
          <li>Finds all occurrences of a pattern.</li>
          <li>Avoids unnecessary character comparisons.</li>
          <li>Simple once the Z-array concept is understood.</li>
        </ul>
      </section>

      {/* Disadvantages */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Disadvantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Requires additional memory for the Z-array.</li>
          <li>The algorithm is less intuitive than naive matching.</li>
          <li>Mainly useful for exact string matching.</li>
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Applications</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Pattern Matching</li>
          <li>Search Engines</li>
          <li>Text Editors</li>
          <li>DNA Sequence Analysis</li>
          <li>Bioinformatics</li>
          <li>Plagiarism Detection</li>
          <li>Compiler Design</li>
          <li>Data Compression</li>
        </ul>
      </section>
    </div>
  );
}