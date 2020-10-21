import ACTIONS from "./actions";
import generateStatsFromRawData from "../StatisticalFunctions/StatsGenerator";

// temp test data
const lotAreas = [
  8450,
  9600,
  11250,
  9550,
  14260,
  14115,
  10084,
  10382,
  6120,
  7420,
  11200,
  11924,
  12968,
  10652,
  10920,
];
const firstFloorSqFts = [
  856,
  1262,
  920,
  961,
  1145,
  796,
  1694,
  1107,
  1022,
  1077,
  1040,
  1182,
  912,
  1494,
  1253,
];
const garageCapacities = [2, 2, 2, 3, 3, 2, 2, 2, 2, 1, 1, 3, 1, 3, 1];
const prices = [
  208500,
  181500,
  223500,
  140000,
  250000,
  143000,
  307000,
  200000,
  129900,
  118000,
  129500,
  345000,
  144000,
  279500,
  157000,
];

const tempTestData = (() => {
  const data = [];
  for (let i = 0; i < lotAreas.length; i++) {
    data.push({
      LotArea: lotAreas[i],
      FirstFlrSqFt: firstFloorSqFts[i],
      GarageCapacity: garageCapacities[i],
      SalePrice: prices[i],
    });
  }

  return data;
})();

const intitialState = {
  rawData: tempTestData,
  targetColumnName: "Test",
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_TEST_TABLE:
      return {
        ...state,
        statsData: generateStatsFromRawData(
          state.rawData,
          state.targetColumnName
        ),
      };
    case ACTIONS.Types.CREATE_TABLE:
      return {
        ...state,
        rawData: action.data,
        statsData: generateStatsFromRawData(
          action.data,
          state.targetColumnName
        ),
      };
    case ACTIONS.Types.CHANGE_TARGET:
      return {
        ...state,
        targetColumnName: action.target,
      };
    default:
      return state;
  }
};
