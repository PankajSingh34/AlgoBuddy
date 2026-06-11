/**
 * Pure function to generate frames for the Recursive Palindrome Check algorithm.
 * Returns an array of frames for the visualizer to step through.
 */
export function generatePalindromeFrames(str) {
  const frames = [];
  const stack = [];
  const len = str.length;
  let frameIdCounter = 0;

  function run(i, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "isPalindrome",
      i,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 1,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "normal",
      description: `Calling isPalindrome(i = ${i}). Compares characters from outer bounds inwards.`,
      activeFrameId: myId,
    });

    stack[stack.length - 1].status = "checking_base";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 2,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "normal",
      description: `Checking base case: is pointer i (${i}) >= middle (${Math.floor(len / 2)})?`,
      activeFrameId: myId,
    });

    if (i >= Math.floor(len / 2)) {
      stack[stack.length - 1].status = "base_case";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 2,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "success",
        description: `Base case met! i (${i}) >= middle. Pointers crossed; all checked indices match. Returning true.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = "true";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 2,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "success",
        description: `Returning true from isPalindrome(i = ${i}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return true;
    }

    // Compare characters
    const charL = str[i].toLowerCase();
    const charR = str[len - 1 - i].toLowerCase();

    stack[stack.length - 1].status = "comparing";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 3,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: charL === charR ? "success" : "error",
      description: `Comparing str[${i}] ('${str[i]}') and str[${len - 1 - i}] ('${str[len - 1 - i]}').`,
      activeFrameId: myId,
    });

    if (charL !== charR) {
      stack[stack.length - 1].status = "mismatch";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "error",
        description: `Mismatch! '${str[i]}' !== '${str[len - 1 - i]}'. Returning false immediately.`,
        activeFrameId: myId,
      });

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = "false";
      frames.push({
        stack: JSON.parse(JSON.stringify(stack)),
        activeLine: 3,
        iIndex: i,
        oppIndex: len - 1 - i,
        statusType: "error",
        description: `Returning false from isPalindrome(i = ${i}).`,
        activeFrameId: myId,
      });

      stack.pop();
      return false;
    }

    stack[stack.length - 1].status = "waiting";
    frames.push({
      stack: JSON.parse(JSON.stringify(stack)),
      activeLine: 4,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: "success",
      description: `Characters match. Making recursive call: isPalindrome(i = ${i + 1}).`,
      activeFrameId: myId,
    });

    const subResult = run(i + 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "returning";
    stack[myFrameIndex].retVal = String(subResult);

    frames.push({
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      activeLine: 4,
      iIndex: i,
      oppIndex: len - 1 - i,
      statusType: subResult ? "success" : "error",
      description: `Inner call returned ${subResult}. Returning ${subResult} from isPalindrome(i = ${i}).`,
      activeFrameId: myId,
    });

    stack.pop();
    return subResult;
  }

  const finalResult = run(0);
  frames.push({
    stack: [],
    activeLine: 0,
    iIndex: -1,
    oppIndex: -1,
    statusType: finalResult ? "success" : "error",
    description: `Recursion finished. String is${finalResult ? "" : " NOT"} a palindrome. Returns ${finalResult}.`,
    activeFrameId: null,
  });

  return frames;
}
