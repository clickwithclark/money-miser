import PropTypes from 'prop-types';
import Statement from './Statement.jsx';

const StatementGroup = ({ statements, date, onDeleteBtn }) => (
  <div className="transaction-group">
    <h2 className="group-heading">{date}</h2>
    {Object.keys(statements).map((key) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Statement key={key} statement={statements[key]} onDeleteBtn={onDeleteBtn} />

      // <Statement key={key} {...statements[key]} onDeleteBtn={onDeleteBtn} />
    ))}
  </div>
);
StatementGroup.propTypes = {
  statements: PropTypes.object,
  date: PropTypes.string,
  onDeleteBtn: PropTypes.func,
};

export default StatementGroup;
