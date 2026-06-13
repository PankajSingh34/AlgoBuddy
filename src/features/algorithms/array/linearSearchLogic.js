export function* linearSearchGenerator(arr, targetValue) {
  for (let index = 0; index < arr.length; index++) {
    yield { type: 'checking', index };
    
    if (arr[index] === targetValue) {
      yield { type: 'found', index };
      return;
    }
  }
  
  yield { type: 'not_found' };
}
