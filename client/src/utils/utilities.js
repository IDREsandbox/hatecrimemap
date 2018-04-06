export function removeDuplicates(arr) {
  const uniqueArray = [];
  const seen = new Set();
  for (let i = 0; i < arr.length; i++) {
    const { featureid } = arr[i];
    if (!seen.has(featureid)) {
      seen.add(featureid);
      uniqueArray.push(arr[i]);
    }
  }
  return uniqueArray;
}

export function arrToObject(arr) {
  const obj = arr.reduce((acc, elem) => {
    acc[elem.name] = Object.assign({}, elem);
    return acc;
  }, {});
  return obj;
}
