import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Statement = ({ statement: { amount, date, id, name, type }, onDeleteBtn }) => {
  const [statementOverviewClasses, setStatementOverviewClasses] = useState(['statement-overview']);

  const [isFocused, setIsFocused] = useState(false);

  const showDeleteBtn = (e) => {
    setIsFocused(true);
  };

  const hideDeleteBtn = (e) => {
    setIsFocused(false);
  };

  /* -------------------------------------------------------------------*/
  // #region [handle click outside delete button to hide delete button]
  /* -------------------------------------------------------------------*/
  const statementRef = useRef(null);
  useEffect(() => {
    // Function for click event
    function handleOutsideClick(event, someRef) {
      if (!someRef?.current?.contains(event.target)) {
        hideDeleteBtn(event);
      }
    }

    // Adding click event listener
    document.addEventListener('click', (event) => handleOutsideClick(event, statementRef));
  }, [statementRef]);
  /* -------------------------------------------------------------------*/
  // #endregion [handle click outside delete button to hide delete button]
  return (
    <>
      <div className={statementOverviewClasses.join(' ')} onPointerUp={(e) => showDeleteBtn(e)} ref={statementRef}>
        <button
          className={isFocused ? 'delete-btn delete-btn--visible' : 'delete-btn'}
          data-id={id}
          type="button"
          onPointerUp={(e) => onDeleteBtn(e)}
          onBlur={(e) => hideDeleteBtn(e)}
        >
          ✖
        </button>
        <div className="statement-date">{date.day}</div>
        <div className="statement-name-type">
          <div className="statement-name">{name}</div>
          <div className="statement-type">{type}</div>
        </div>
        <div className={`statement-amount ${type === 'Income' ? 'plus' : 'minus'}`}>{amount}</div>
      </div>
    </>
  );
};
Statement.propTypes = {
  statement: PropTypes.shape({
    amount: PropTypes.number,
    date: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  onDeleteBtn: PropTypes.func,
};

export default Statement;
