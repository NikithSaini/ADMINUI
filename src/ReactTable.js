import React, { useEffect, useState } from "react";
import "./ReactTable.css";
import SearchInput from "./SearchInput";
import PageControls from "./PageControls";

const UserTable = () => {
  const getUserDataFromLocalStorage = () => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : [];
  };
  const [userData, setUserData] = useState(getUserDataFromLocalStorage());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);
  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const jsonData = await response.json();
      setUserData(jsonData);
      localStorage.setItem("userData", JSON.stringify(jsonData));
    } catch (error) {
      console.error("Cannot Fetch Data:", error);
    }
  };

  useEffect(() => {
    // Check if data exists in localStorage
    const localUserData = JSON.parse(localStorage.getItem("userData"));
    if (localUserData) {
      setUserData(localUserData);
    } else {
      fetchData();
    }
  }, []);

  // Update localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const filteredData = userData.filter((row) => {
    // Convert the search query to lowercase for a case-insensitive search
    const searchQueryLower = searchQuery.toLowerCase();

    // Check if any value in the row contains the search query
    const containsSearchQuery = Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQueryLower)
    );

    return containsSearchQuery;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (newPage) => {
    setSelectAllChecked([]);
    setCurrentPage(newPage);
  };

  const checkAllRows = () => {
    if (selectAllChecked.length === currentRows.length) {
      setSelectAllChecked([]);
      setSelectedRows([]);
    } else {
      const allRowIds = currentRows.map((row) => row.id);
      setSelectAllChecked(allRowIds);
      setSelectedRows(allRowIds);
    }
  };

  const handleRowCheck = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const deleteRow = (rowId) => {
    const updatedUserData = userData.filter((row) => row.id !== rowId);
    setUserData(updatedUserData);
  };

  const handleEdit = (id) => {
    setEditingRowId(id);
  };

  const handleEditInputChange = (id, fieldName, value) => {
    const updatedUserData = userData.map((row) =>
      row.id === id ? { ...row, [fieldName]: value } : row
    );
    setUserData(updatedUserData);
  };

  const handleSaveEdit = (id) => {
    setEditingRowId(null); // Finish editing
    const editedRow = userData.find((row) => row.id === id);
    const updatedUserData = userData.map((row) =>
      row.id === id ? editedRow : row
    );
    setUserData(updatedUserData);
  };

  const handleCancelEdit = (id) => {
    setEditingRowId(null); // Cancel editing
  };

  const handleDeleteSelected = () => {
    const updatedUserData = userData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setUserData(updatedUserData);
    setSelectedRows([]);
  };

  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <SearchInput handleSearch={handleSearch} searchQuery={searchQuery} />
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="All"
                checked={selectAllChecked.length === currentRows.length}
                onChange={checkAllRows}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className={selectedRows.includes(row.id) ? "selected-row" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowCheck(row.id)}
                />
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "name", e.target.value)
                    }
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.email}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "email", e.target.value)
                    }
                  />
                ) : (
                  row.email
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "role", e.target.value)
                    }
                  />
                ) : (
                  row.role
                )}
              </td>
              <td>
                <div className="icons">
                  {editingRowId === row.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row.id)}
                        className="fa-solid fa-check"
                      ></button>
                      <button
                        onClick={() => handleCancelEdit(row.id)}
                        className="fa-solid fa-window-close"
                      ></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(row.id)}>
                        <i
                          className="fa-solid fa-pen-to-square"
                          name="edit"
                        ></i>
                      </button>
                      <button
                        className="fa-solid fa-trash"
                        name="delete"
                        value={row.id}
                        onClick={(e) => deleteRow(e.target.value)}
                      ></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PageControls
        totalPageCount={Math.ceil(filteredData.length / rowsPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
};

export default UserTable;
