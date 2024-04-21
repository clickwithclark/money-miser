export const list = document.getElementById('list');

export function addTransactionToDOM(transaction) {
  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');

  item.innerHTML = `
  ${transaction.name} <span>${transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(
    2
  )}</span> <button class="delete-btn" data-id='${transaction.id}'>x</button>
    `;

  list.appendChild(item);
}
