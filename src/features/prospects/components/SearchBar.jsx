import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by company, contact person, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <style>{`
        .search-container{
          flex:1;
          max-width:380px;
        }

        .search-container input{
          width:100%;
          height:36px;
          padding:0 12px;
          border:1px solid #d1d5db;
          border-radius:6px;
          font-size:12px;
          color:#374151;
          background:#fff;
          outline:none;
          transition:.2s ease;
          box-sizing:border-box;
        }

        .search-container input::placeholder{
          color:#9ca3af;
          font-size:12px;
        }

        .search-container input:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 2px rgba(37,99,235,.12);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;