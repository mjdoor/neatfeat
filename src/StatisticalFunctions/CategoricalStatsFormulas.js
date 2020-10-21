export const filterOutNull = arr => {
  const removedIndices = [];
  const filteredArr = arr.filter((el, idx) => {
    const keep = el !== null && el !== undefined;
    if (!keep) {
      removedIndices.push(idx);
    }
    return keep;
  });
  return { filteredArr, removedIndices };
};

export const valueCounts = arr => {
  return arr.reduce((counts, val) => {
    counts[val] = counts[val] === undefined ? 1 : ++counts[val];
    return counts;
  }, {});
};
