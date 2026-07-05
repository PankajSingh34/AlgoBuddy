export function* shellSortGenerator(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    let step = 0;
    let comparisons = 0;
    let swaps = 0;

    // A rough estimation for total steps for the progress bar
    let totalSteps = 0;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        totalSteps += (n - gap) * (Math.log2(n) / 2); // Approximation
    }
    totalSteps = Math.round(totalSteps);

    yield { type: 'init', payload: { totalSteps } };
    step++;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        yield { type: 'gap_start', payload: { step, gap, totalSteps } };
        step++;

        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            yield { type: 'outer_loop', payload: { step, i, temp, gap, totalSteps } };
            step++;

            let j = i;
            while (j >= gap) {
                comparisons++;
                yield { type: 'comparing', payload: { step, arr, j, gap, temp, comparisons, totalSteps } };
                step++;

                if (arr[j - gap] > temp) {
                    swaps++;
                    arr[j] = arr[j - gap];
                    yield { type: 'shift', payload: { step, arr: [...arr], j: j - gap, swaps, totalSteps } };
                    step++;
                    j -= gap;
                } else {
                    break;
                }
            }

            if (arr[j] !== temp) {
                swaps++;
            }
            arr[j] = temp;
            yield { type: 'insertion', payload: { step, arr: [...arr], j, temp, swaps, totalSteps } };
            step++;
        }
    }

    yield {
        type: 'completed',
        payload: { arr, step, comparisons, swaps, totalSteps: step }
    };
}