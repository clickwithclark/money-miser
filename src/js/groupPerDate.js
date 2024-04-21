export function groupPerDate(statementsState, date) {
  const perGroup = {};
  Object.keys(statementsState).forEach((key) => {
    if (`${statementsState[key].date.month} ${statementsState[key].date.year}` === date) {
      return (perGroup[key] = statementsState[key]);
    }
  });
  return perGroup;
}
