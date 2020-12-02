import { factorial } from "mathjs";

export const roundNum = (num, places) => {
  if (isNaN(Number(num))) {
    return num;
  }
  if (!Number.isInteger(places)) {
    places = Math.round(places);
  }
  if (places === 0 || places === null || places === undefined) {
    return Math.round(num);
  }
  if (places > 10) {
    places = 10;
  } else if (places < 0) {
    places = 0;
  }
  const multiplier = Math.pow(10, places);
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
};

export const combinationWithReplacement = (n, r) => {
  return factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
};
