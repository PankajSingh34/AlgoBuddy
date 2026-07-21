export default function Content() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 space-y-8">

      {/* Problem Statement */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Problem Statement
        </h2>

        <p className="text-gray-700 leading-8">
          Given a string <strong>s</strong>, find the length of the
          longest substring without repeating characters.
        </p>

        <div className="bg-indigo-50 p-4 rounded-lg mt-4">
          <p>
            <strong>Example 1</strong>
          </p>

          <p className="mt-2">
            Input: <code>"abcabcbb"</code>
          </p>

          <p>Output: <code>3</code></p>

          <p className="mt-2">
            Explanation: The longest substring is
            <strong> "abc"</strong>.
          </p>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg mt-4">
          <p>
            <strong>Example 2</strong>
          </p>

          <p className="mt-2">
            Input: <code>"bbbbb"</code>
          </p>

          <p>Output: <code>1</code></p>

          <p className="mt-2">
            Explanation: Longest substring is
            <strong> "b"</strong>.
          </p>
        </div>
      </section>

      {/* Algorithm */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Sliding Window Algorithm
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-gray-700 leading-8">

          <li>Create an empty HashMap.</li>

          <li>Maintain two pointers: Left and Right.</li>

          <li>Move Right pointer one step at a time.</li>

          <li>
            If the character already exists inside the current window,
            move Left pointer after its previous occurrence.
          </li>

          <li>
            Store current character's latest index in the HashMap.
          </li>

          <li>
            Update the maximum window length.
          </li>

          <li>
            Continue until Right reaches the end.
          </li>

        </ol>

      </section>

      {/* Dry Run */}
      <section>

        <h2 className="text-3xl font-bold mb-4">
          Dry Run
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-indigo-100">

              <tr>

                <th className="border p-3">Step</th>
                <th className="border p-3">Character</th>
                <th className="border p-3">Left</th>
                <th className="border p-3">Right</th>
                <th className="border p-3">Window</th>
                <th className="border p-3">Max Length</th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="border p-3">1</td>
                <td className="border p-3">a</td>
                <td className="border p-3">0</td>
                <td className="border p-3">0</td>
                <td className="border p-3">a</td>
                <td className="border p-3">1</td>
              </tr>

              <tr>
                <td className="border p-3">2</td>
                <td className="border p-3">b</td>
                <td className="border p-3">0</td>
                <td className="border p-3">1</td>
                <td className="border p-3">ab</td>
                <td className="border p-3">2</td>
              </tr>

              <tr>
                <td className="border p-3">3</td>
                <td className="border p-3">c</td>
                <td className="border p-3">0</td>
                <td className="border p-3">2</td>
                <td className="border p-3">abc</td>
                <td className="border p-3">3</td>
              </tr>

              <tr>
                <td className="border p-3">4</td>
                <td className="border p-3">a</td>
                <td className="border p-3">1</td>
                <td className="border p-3">3</td>
                <td className="border p-3">bca</td>
                <td className="border p-3">3</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      {/* Complexity */}

      <section>

        <h2 className="text-3xl font-bold mb-4">
          Complexity Analysis
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-green-50 rounded-lg p-6">

            <h3 className="text-xl font-bold mb-2">
              Time Complexity
            </h3>

            <p className="text-4xl font-bold text-green-700">
              O(n)
            </p>

            <p className="mt-3 text-gray-700">
              Each character is visited at most twice.
            </p>

          </div>

          <div className="bg-blue-50 rounded-lg p-6">

            <h3 className="text-xl font-bold mb-2">
              Space Complexity
            </h3>

            <p className="text-4xl font-bold text-blue-700">
              O(min(n, charset))
            </p>

            <p className="mt-3 text-gray-700">
              HashMap stores the latest index of characters.
            </p>

          </div>

        </div>

      </section>

      {/* Applications */}

      <section>

        <h2 className="text-3xl font-bold mb-4">
          Applications
        </h2>

        <ul className="list-disc pl-6 space-y-3 text-gray-700">

          <li>Text Processing</li>

          <li>Compiler Design</li>

          <li>Pattern Matching</li>

          <li>Data Compression</li>

          <li>Bioinformatics</li>

          <li>Cyber Security</li>

          <li>Natural Language Processing</li>

          <li>Search Engines</li>

        </ul>

      </section>

      {/* Interview Tips */}

      <section>

        <h2 className="text-3xl font-bold mb-4">
          Interview Tips
        </h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded">

          <ul className="list-disc pl-6 space-y-3">

            <li>
              Sliding Window is the most optimized approach.
            </li>

            <li>
              Avoid nested loops for better performance.
            </li>

            <li>
              Always update the HashMap after processing a character.
            </li>

            <li>
              Move the Left pointer only forward.
            </li>

            <li>
              Be comfortable explaining why the algorithm is O(n).
            </li>

          </ul>

        </div>

      </section>

    </div>
  );
}