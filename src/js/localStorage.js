export function setLocalStorage(transactions) {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
export function getLocalStorage() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) ?? {};
  return transactions;
}
