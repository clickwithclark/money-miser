import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid'
import dayjs from 'dayjs';
import { getLocalStorage, setLocalStorage } from '../js/localStorage.js';
import StatementGroup from './StatementGroup.jsx';
import { getGroups } from '../js/getGroups';
import { capitalizeFirstLetter } from '../js/capitalizeFirstLetter';
import { groupPerDate } from '../js/groupPerDate';

getLocalStorage();

const Main = () => {
  const localStorageStatements = getLocalStorage();

  const [income, setIncome] = useState('0.00');
  const [expense, setExpense] = useState('0.00');
  const [balance, setBalance] = useState('0.00');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [statementsState, setStatementsState] = useState(localStorageStatements);
  const [groups, setGroups] = useState([]);
  // 15 chosen to accommodate up to 100 billion entry (12 characters)
  // as well as cents value (3 characters including the period)
  // eg. 120B = 120 000 000 000 . 67 = 15 characters long
  const MAX_CHAR_LENGTH = 15;
  const [statementContainerClasses, setStatementContainerClasses] = useState(['statement-container']);
  /* -------------------------------------------------------------------*/
  // #region [adding scroll based on statement count]
  /* -------------------------------------------------------------------*/

  useEffect(() => {
    setGroups(getGroups(statementsState));
    // eslint-disable-next-line no-unused-expressions
    Object.keys(localStorageStatements).length > 2
      ? setStatementContainerClasses([...statementContainerClasses, 'scroll'])
      : setStatementContainerClasses(statementContainerClasses.filter((item) => item !== 'scroll'));
  }, [statementsState]);

  /* -------------------------------------------------------------------*/
  // #endregion [adding scroll based on statement count]

  useEffect(() => {
    // calculate total amount
    const amounts = [];
    Object.keys(statementsState).forEach((value) => amounts.push(statementsState[value].amount));
    // eslint-disable-next-line no-param-reassign
    const total = amounts.reduce((accumulator, item) => (accumulator += item), 0);

    // format balance nicely for larger numbers
    // check for exponential values by the presence of a '+' sign
    // eg.  2e+2, indicating a 'too big' number
    // then display the compact version

    setBalance(
      `${total}`.includes('+') || `${total}`.length > MAX_CHAR_LENGTH
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            // maximumFractionDigits: 2,
            // roundingIncrement: 5,
            notation: 'compact',
            compactDisplay: 'short',
          }).format(total)
        : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
            roundingIncrement: 5,
          }).format(total)
    );

    // calculate income amount
    const newIncome = amounts
      .filter((item) => item > 0)
      // eslint-disable-next-line no-param-reassign
      .reduce((accumulator, item) => (accumulator += item), 0)
      .toFixed(2);
    setIncome(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
        roundingIncrement: 5,
      }).format(newIncome)
    );

    // calculate expense  amount
    // eslint-disable-next-line no-param-reassign
    const newExpense = (amounts.filter((item) => item < 0).reduce((accumulator, item) => (accumulator += item), 0) * -1).toFixed(2);

    setExpense(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
        roundingIncrement: 5,
      }).format(newExpense)
    );
  }, [statementsState]);

  let sign;

  const handleIncomeBtn = (e) => {
    e.preventDefault();
    sign = '+';
  };

  const handleExpenseBtn = (e) => {
    e.preventDefault();
    sign = '-';
  };
  const handleDeleteBtn = (e) => {
    const { id } = e.target.dataset;
    const statementsRemaining = getLocalStorage();
    delete statementsRemaining[id];
    setLocalStorage(statementsRemaining);
    setStatementsState(statementsRemaining);
  };

  function addStatement(e) {
    e.preventDefault();
    const statementName = document.getElementById('name').value.trim();
    let statementAmount = document.getElementById('amount').value.trim();
    const statements = getLocalStorage();

    // ensure user chose income or expense
    if (!sign) {
      alert('Please ensure statement is Income or Expense');
      return;
    }
    if (statementName === '' || statementAmount === '') {
      alert('Please add a name and amount');
      return;
    }
    // save number (if huge) without exponent notation to check
    // true character length
    statementAmount = new Intl.NumberFormat('en-US', {
      useGrouping: false,
    }).format(statementAmount);

    if (`${statementAmount}`.length > MAX_CHAR_LENGTH) {
      alert('Too Much Money!\nThis application is intended for personal use! \nNot Asset Management in a Bank! :)');
      return;
    }
    const statement = {
      id: nanoid(),
      name: capitalizeFirstLetter(statementName),
      amount: +parseFloat(sign === '+' ? statementAmount : statementAmount * -1).toFixed(2),
      type: sign === '+' ? 'Income' : 'Expense',
      date: {
        day: dayjs(date).format('DD'),
        month: dayjs(date).format('MMM'),
        year: dayjs(date).format('YYYY'),
      },
    };

    Object.assign(statements, { [statement.id]: statement });
    setLocalStorage(statements);
    setStatementsState(statements);
    setName('');
    setAmount('');
  }
  // Main>statementGroup>Statement

  return (
    <div className="container">
      <div className="balance-inc-exp-container">
        <div className="balance-container">
          <h4>Balance</h4>
          <p id="balance">{balance}</p>
        </div>
        <hr />
        <div className="income-container">
          <h4>Income</h4>
          <p id="money-plus" className="money plus">
            +{income}
          </p>
        </div>
        <hr />
        <div className="expense-container">
          <h4>Expense</h4>
          <p id="money-minus" className="money minus">
            -{expense}
          </p>
        </div>
      </div>

      <h3>Statements</h3>
      <div className={statementContainerClasses.join(' ')}>
        {groups.map((theDate, index) => {
          const perGroup = groupPerDate(statementsState, theDate);
          return <StatementGroup key={index} statements={{ ...perGroup }} date={theDate} onDeleteBtn={handleDeleteBtn} />;
        })}
      </div>

      <h3>Add New Statement</h3>
      <form id="form" onSubmit={(e) => addStatement(e)}>
        <div className="form-control">
          <input type="text" id="name" placeholder="Enter name..." onChange={(event) => setName(event.target.value)} value={name} />
        </div>
        <div className="form-control">
          <input
            type="number"
            id="amount"
            placeholder="Enter amount..."
            step="0.01"
            onChange={(event) => setAmount(event.target.value)}
            value={amount}
          />
        </div>
        <div className="form-control">
          <input
            type="date"
            className="date-picker"
            id="date"
            onChange={(event) => setDate(event.target.value)}
            defaultValue={date}
            min="2000-01-01"
            step="0.01"
          />
        </div>
        <div className="income-or-expense-container">
          <button className="income-btn" onPointerUp={(e) => handleIncomeBtn(e)} type="submit">
            income
          </button>
          <button className="expense-btn" onPointerUp={(e) => handleExpenseBtn(e)} type="submit">
            expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default Main;
