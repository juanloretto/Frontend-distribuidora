import { useState } from "react";

const SearchBarApp = ({ placeholder = "Buscar...", onSearch }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    setValue(text);

    // búsqueda en tiempo real (opcional)
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <div className="mb-3">
      <input
        type="search"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBarApp;