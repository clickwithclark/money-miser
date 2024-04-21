import dayjs from 'dayjs';

export function getGroups(statementsState) {
  let dateGroups = [];

  Object.keys(statementsState).forEach((key) => {
    dateGroups = [
      ...dateGroups,
      ...[`${statementsState[key].date.month} ${statementsState[key].date.year}`].filter((group) => !dateGroups.includes(group)),
    ];
  });

  // Decending order sort: so latest groups by date shown first
  dateGroups.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? 1 : -1));

  return dateGroups;
}
