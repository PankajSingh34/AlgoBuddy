export default function Content() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Overview</h2>

        <p className="text-slate-700 dark:text-slate-300 leading-7">
          The <strong>Minimum Window Substring</strong> problem is a classic
          Sliding Window algorithm. Given a string <strong>s</strong> and a
          target string <strong>t</strong>, the goal is to find the smallest
          substring in <strong>s</strong> that contains every character of
          <strong> t</strong>, including duplicate occurrences.
        </p>

        <p className="text-slate-700 dark:text-slate-300 leading-7 mt-3">
          Instead of checking every possible substring, the Sliding Window
          technique dynamically expands and shrinks the current window,
          resulting in an efficient linear-time solution.
        </p>
      </section>

      {/* Working */}
      <section>
        <h2 className="text-2xl font-bold mb-3">How It Works</h2>

        <ol className="list-decimal ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Create a frequency map for all characters in the target string.</li>
          <li>Expand the window using the right pointer.</li>
          <li>Track the frequency of characters inside the current window.</li>
          <li>Once every required character is included, shrink the window from the left.</li>
          <li>Update the minimum window whenever a smaller valid window is found.</li>
          <li>Continue until the right pointer reaches the end of the string.</li>
        </ol>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Example</h2>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-5">
          <p>
            <strong>Text:</strong> ADOBECODEBANC
          </p>

          <p>
            <strong>Pattern:</strong> ABC
          </p>

          <p className="mt-4">
            The smallest substring containing all the required characters is:
          </p>

          <code className="block mt-3 rounded bg-white dark:bg-slate-900 p-3">
            BANC
          </code>
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
                <td className="border p-3">O(m)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Advantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Efficient linear-time solution.</li>
          <li>Avoids checking every possible substring.</li>
          <li>Uses the Sliding Window technique effectively.</li>
          <li>Suitable for large input strings.</li>
          <li>Frequently used in coding interviews.</li>
        </ul>
      </section>

      {/* Disadvantages */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Disadvantages</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Requires additional memory for frequency maps.</li>
          <li>Can be difficult to understand for beginners.</li>
          <li>Careful pointer management is required.</li>
        </ul>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Applications</h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Text Searching</li>
          <li>Search Engines</li>
          <li>DNA Sequence Analysis</li>
          <li>Natural Language Processing (NLP)</li>
          <li>Log Analysis</li>
          <li>Pattern Matching</li>
          <li>Data Stream Processing</li>
          <li>Coding Interview Problems</li>
        </ul>
      </section>
    </div>
  );
}