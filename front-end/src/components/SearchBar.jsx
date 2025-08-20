import { useState } from "react";

const SearchBar = ({ onEnter }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onEnter(value);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
      />
      <button onClick={() => onEnter(value)}>Search</button>
    </div>
  );
};

export default SearchBar;