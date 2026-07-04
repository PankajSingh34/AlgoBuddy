export function* bucketSortGenerator(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;

    let step = 0;
    let comparisons = 0;
    let swaps = 0;

    // Rough estimation for progress bar
    const bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
    const totalSteps =
        5 +
        n + // distribute
        bucketCount + // bucket sorting
        n + // merging
        bucketCount;

    yield {
        type: "init",
        payload: { totalSteps },
    };
    step++;

    if (n === 0) {
        yield {
            type: "completed",
            payload: {
                arr,
                step,
                comparisons,
                swaps,
                totalSteps: step,
            },
        };
        return;
    }

    const min = Math.min(...arr);
    const max = Math.max(...arr);

    yield {
        type: "find_range",
        payload: {
            step,
            min,
            max,
            totalSteps,
        },
    };
    step++;

    const buckets = Array.from({ length: bucketCount }, () => []);

    yield {
        type: "create_buckets",
        payload: {
            step,
            bucketCount,
            buckets: buckets.map((b) => [...b]),
            totalSteps,
        },
    };
    step++;

    for (let i = 0; i < n; i++) {
        let index =
            max === min
                ? 0
                : Math.floor(((arr[i] - min) / (max - min)) * (bucketCount - 1));

        buckets[index].push(arr[i]);

        yield {
            type: "bucket_insert",
            payload: {
                step,
                value: arr[i],
                bucketIndex: index,
                buckets: buckets.map((b) => [...b]),
                totalSteps,
            },
        };
        step++;
    }

    for (let b = 0; b < bucketCount; b++) {
        yield {
            type: "bucket_sort_start",
            payload: {
                step,
                bucketIndex: b,
                bucket: [...buckets[b]],
                totalSteps,
            },
        };
        step++;

        // Insertion Sort inside bucket
        for (let i = 1; i < buckets[b].length; i++) {
            let key = buckets[b][i];
            let j = i - 1;

            while (j >= 0) {
                comparisons++;

                yield {
                    type: "bucket_compare",
                    payload: {
                        step,
                        bucketIndex: b,
                        bucket: [...buckets[b]],
                        current: j,
                        next: j + 1,
                        comparisons,
                        totalSteps,
                    },
                };
                step++;

                if (buckets[b][j] > key) {
                    swaps++;
                    buckets[b][j + 1] = buckets[b][j];

                    yield {
                        type: "bucket_shift",
                        payload: {
                            step,
                            bucketIndex: b,
                            bucket: [...buckets[b]],
                            swaps,
                            totalSteps,
                        },
                    };
                    step++;

                    j--;
                } else {
                    break;
                }
            }

            buckets[b][j + 1] = key;

            yield {
                type: "bucket_insert_sorted",
                payload: {
                    step,
                    bucketIndex: b,
                    bucket: [...buckets[b]],
                    totalSteps,
                },
            };
            step++;
        }
    }

    // -----------------------------
    // Merge Buckets
    // -----------------------------
    let k = 0;

    for (let b = 0; b < bucketCount; b++) {
        for (let value of buckets[b]) {
            arr[k] = value;

            yield {
                type: "merge",
                payload: {
                    step,
                    arr: [...arr],
                    value,
                    bucketIndex: b,
                    index: k,
                    totalSteps,
                },
            };
            step++;

            k++;
        }
    }

    yield {
        type: "completed",
        payload: {
            arr,
            step,
            comparisons,
            swaps,
            totalSteps: step,
        },
    };
}
