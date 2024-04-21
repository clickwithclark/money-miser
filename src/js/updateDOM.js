import { addTransactionToDOM, list } from './addTransactionToDOM.js';

const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
export const transactions = localStorageTransactions !== null ? localStorageTransactions : {};
/* -------------------------------------------------------------------*/
// #endregion of Update the balance, income and expense
// Init app

export function updateValues() {
  const amounts = [];
  Object.keys(transactions).forEach((singleTransaction) => amounts.push(transactions[singleTransaction].amount));

  // eslint-disable-next-line no-param-reassign
  const total = amounts.reduce((accumulator, item) => (accumulator += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    // eslint-disable-next-line no-param-reassign
    .reduce((accumulator, item) => (accumulator += item), 0)
    .toFixed(2);

  //* by -1 to convert negative stored values to positive values
  // as a - sign will be added when building list item
  // eslint-disable-next-line no-param-reassign
  const expense = (amounts.filter((item) => item < 0).reduce((accumulator, item) => (accumulator += item), 0) * -1).toFixed(2);

  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
}

export function updateDOM() {
  list.innerHTML = '';

  Object.keys(transactions).forEach((oneTransaction) => {
    addTransactionToDOM(transactions[oneTransaction]);
  });

  updateValues();
}
