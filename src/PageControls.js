import React from "react";
import "./PageControls.css"; // Updated CSS file name

const PageControls = ({
  totalPageCount,
  currentPage,
  onPageChange,
  onDeleteSelected
}) => {
  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div className="page-controls">
      <button className="delete-button" onClick={onDeleteSelected}>
        Delete Selected
      </button>
      <ul>
        <li>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-angles-left fa-xl"></i>
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
        </li>
        {Array.from({ length: totalPageCount }, (v, i) => (
          <li key={i}>
            <button
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPageCount}
          >
            <i className="fa-solid fa-angle-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageChange(totalPageCount)}
            disabled={currentPage === totalPageCount}
          >
            <i className="fa-solid fa-angles-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PageControls;
