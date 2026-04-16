import { MdSearch, MdClose } from "react-icons/md";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-bar">
      <MdSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")}>
          <MdClose />
        </button>
      )}
    </div>
  );
}
