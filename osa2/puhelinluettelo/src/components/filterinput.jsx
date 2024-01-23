const FilterInput = ({ value, onChange }) => {
    return (
      <input 
        value={value}
        onChange={onChange}
        placeholder='Filter Names'
      />
    );
  };
  
  export default FilterInput;
  