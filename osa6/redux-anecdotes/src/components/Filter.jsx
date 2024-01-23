import { useDispatch } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';

const Filter = () => {
  const dispatch = useDispatch();

  const handleFilterChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  const style = {
    marginBottom: 10
  };

  return (
    <div style={style}>
      <input 
        type="text" 
        name="filter" 
        onChange={handleFilterChange} 
        placeholder="Filter anecdotes" 
      />
    </div>
  );
};

export default Filter;
