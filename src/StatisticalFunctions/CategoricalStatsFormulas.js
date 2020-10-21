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
  const valueCounts = arr.reduce((counts, val) => {
    counts[val] = counts[val] === undefined ? 1 : ++counts[val];
    return counts;
  }, {});

  // sorts the valueCounts object keys by value, descending
  return Object.fromEntries(
    Object.entries(valueCounts).sort((lhs, rhs) => rhs[1] - lhs[1])
  );
};
