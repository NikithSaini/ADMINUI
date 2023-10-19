import React from "react";

const SearchInput = ({ handleSearch, searchQuery }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, email, or role"
        style={{ width: "100vw", height: "4vh", margin: "5px" }}
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;
