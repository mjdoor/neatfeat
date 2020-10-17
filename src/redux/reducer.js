import ACTIONS from "./actions";
import generateStatsFromRawData from "../StatisticalFunctions/StatsCalculator";

// temp test data
const lotAreas = [8450, 9600, 11250, 9550, 14260];
const firstFloorSqFts = [856, 1262, 920, 961, 1145];
const garageCapacities = [2, 2, 2, 3, 3];
const prices = [208500, 181500, 223500, 140000, 250000];

const tempTestData = (() => {
  const data = [];
  for (let i = 0; i < lotAreas.length; i++) {
    data.push({
      LotArea: lotAreas[i],
      FirstFlrSqFt: firstFloorSqFts[i],
      GarageCapacity: garageCapacities[i],
      SalePrice: prices[i]
    });
  }

  return data;
})();

const intitialState = {
  rawData: tempTestData,
  targetColumnName: "SalePrice"
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_TEST_TABLE:
      return {
        ...state,
        statsData: generateStatsFromRawData(
          state.rawData,
          state.targetColumnName
        )
      };
    case ACTIONS.Types.CREATING_TABLE:
      return {
        ...state,
        rawData: action.data,
        statsData: generateStatsFromRawData(action.data, state.targetColumnName)
      };
    default:
      return state;
  }
};
