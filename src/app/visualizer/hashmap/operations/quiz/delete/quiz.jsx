"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Which method is used to remove a key-value pair from a HashMap in Java?",
    options: [
      "delete()",
      "remove()",
      "erase()",
      "pop()"
    ],
    correctAnswer: 1,
    explanation:
      "The remove() method deletes the mapping associated with the specified key."
  },
  {
    question: "What happens if remove() is called with a key that does not exist?",
    options: [
      "An exception is thrown",
      "The program terminates",
      "null is returned",
      "The HashMap is cleared"
    ],
    correctAnswer: 2,
    explanation:
      "If the specified key is absent, remove() simply returns null."
  },
  {
    question: "What is the average time complexity of the remove() operation?",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "HashMap deletion is O(1) on average because the key's bucket is found using hashing."
  },
  {
    question: "Which method removes all key-value pairs from a HashMap?",
    options: [
      "deleteAll()",
      "removeAll()",
      "clear()",
      "reset()"
    ],
    correctAnswer: 2,
    explanation:
      "The clear() method removes every mapping from the HashMap."
  },
  {
    question: "What does remove(key) return when the key exists?",
    options: [
      "true",
      "The removed value",
      "The removed key",
      "Nothing"
    ],
    correctAnswer: 1,
    explanation:
      "remove(key) returns the value associated with the removed key."
  },
  {
    question: "Which operation is performed before removing a key from a HashMap?",
    options: [
      "Sorting",
      "Hashing the key",
      "Balancing a tree",
      "Binary Search"
    ],
    correctAnswer: 1,
    explanation:
      "The key is hashed to locate the correct bucket before deletion."
  },
  {
    question: "Which method removes a key only if it is mapped to a specific value?",
    options: [
      "remove(key, value)",
      "delete(key, value)",
      "erase(key)",
      "removeValue()"
    ],
    correctAnswer: 0,
    explanation:
      "remove(key, value) removes the entry only if both the key and value match."
  },
  {
    question: "After deleting a key from a HashMap, searching for that key using get() returns:",
    options: [
      "0",
      "The previous value",
      "null",
      "false"
    ],
    correctAnswer: 2,
    explanation:
      "Once removed, get() returns null because the key no longer exists."
  },
  {
    question: "What is one common use of HashMap deletion?",
    options: [
      "Removing expired cache entries",
      "Sorting data",
      "Balancing trees",
      "Traversing graphs"
    ],
    correctAnswer: 0,
    explanation:
      "HashMaps are often used in caches where outdated or expired entries need to be removed."
  },
  {
    question: "Which of the following HashMap operations has an average time complexity of O(1)?",
    options: [
      "put()",
      "get()",
      "remove()",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Insertion, searching, and deletion all have an average-case time complexity of O(1) in a HashMap."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Delete (remove) Quiz"
      questions={questions}
    />
  );
}