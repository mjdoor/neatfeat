export const filterOutNull = arr => {
  return arr.filter(el => el !== null && el !== undefined);
};

export const valueCounts = arr => {
  return arr.reduce((counts, val) => {
    counts[val] = counts[val] === undefined ? 1 : ++counts[val];
    return counts;
  }, {});
};
