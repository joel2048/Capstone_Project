import { useState } from "react";

const SearchBar = ({ onEnter }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onEnter(value);
  };

  return (
    <div className="flex space-x-2">
      <input
        className="rounded-md"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="検索"
        />
      <button className="my-button" onClick={() => onEnter(value)}>Search</button>
    </div>
  );
};

export default SearchBar;