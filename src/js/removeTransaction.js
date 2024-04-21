import { updateLocalStorage } from './localStorage.js';
import { updateDOM, transactions } from './updateDOM.js';

// Remove transaction by ID
export function removeTransaction(e) {
  const { id } = e.target.dataset;
  delete transactions[id];
  updateLocalStorage();


}
