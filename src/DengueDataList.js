import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import Modal from "react-modal";
import { TbDeviceTabletSearch } from "react-icons/tb"; // Import the new search icon
import { BiBook} from "react-icons/bi"; // Import the chosen icon

Modal.setAppElement("#root");

const DengueDataList = () => {

  const [nutritionData, setNutritionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    country: "",
    income_classification: "",
    severe_wasting: "",
    wasting: "",
    overweight: "",
    stunting: "",
    underweight: "",
    u5_population: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const nutritionCollection = collection(db, "nutritionData");
    const snapshot = await getDocs(nutritionCollection);
    const dataList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNutritionData(dataList);
    setFilteredData(dataList);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = nutritionData.filter((entry) =>
      Object.keys(entry).some((key) =>
        String(entry[key]).toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filteredData);
  }, [searchTerm, nutritionData]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const handleDelete = async () => {
    const nutritionDocRef = doc(db, "nutritionData", deleteId);
    try {
      await deleteDoc(nutritionDocRef);
      setNutritionData(nutritionData.filter((data) => data.id !== deleteId));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    const { id, ...editableData } = data;
    setEditForm(editableData);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const nutritionDocRef = doc(db, "nutritionData", editingId);

    try {
      await updateDoc(nutritionDocRef, {
        ...editForm,
        income_classification: Number(editForm.income_classification),
        severe_wasting: Number(editForm.severe_wasting),
        wasting: Number(editForm.wasting),
        overweight: Number(editForm.overweight),
        stunting: Number(editForm.stunting),
        underweight: Number(editForm.underweight),
        u5_population: Number(editForm.u5_population),
      });

      setNutritionData(
        nutritionData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      setIsEditModalOpen(false);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="data-list-section">
      <div className="search-data-container">
        <TbDeviceTabletSearch className="search-data-icon" />
        <input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-data-field"
        />
      </div>

      {/* Collapsible Legend */}
      <div style={{ marginTop: "20px" }}>
        <details
          style={{
            backgroundColor: "#004d4d",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow
          }}
        >
          <summary
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem", // Increase font size
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px", // Space between icon and text
            }}
          >
            <span className="icon-hover">
              <BiBook size={20} />
            </span>
            Legend: Column Definitions
          </summary>
          <div style={{ marginTop: "10px", lineHeight: "1.5", textAlign: "left" }}>
            <p><strong>Country:</strong> The name of the country.</p>
            <p><strong>Income Classification:</strong></p>
            <ul style={{ marginLeft: "20px", marginBottom: "10px"  }}>
              <li><strong>0:</strong> Low Income</li>
              <li><strong>1:</strong> Lower Middle Income</li>
              <li><strong>2:</strong> Upper Middle Income</li>
              <li><strong>3:</strong> High Income</li>
            </ul>
            <p><strong>Severe Wasting:</strong> Percentage of children severely undernourished.</p>
            <p><strong>Wasting:</strong> Percentage of children with moderate malnutrition.</p>
            <p><strong>Overweight:</strong> Percentage of children who are overweight.</p>
            <p><strong>Stunting:</strong> Percentage of children with growth failure due to malnutrition.</p>
            <p><strong>Underweight:</strong> Percentage of children underweight for their age.</p>
            <p><strong>U5 Population:</strong> Population of children under 5 years old (in thousands).</p>
          </div>
        </details>
      </div>

      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Income Classification</th>
            <th>Severe Wasting</th>
            <th>Wasting</th>
            <th>Overweight</th>
            <th>Stunting</th>
            <th>Underweight</th>
            <th>U5 Population</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((data) => (
            <tr key={data.id}>
              <td>{data.country}</td>
              <td>{data.income_classification}</td>
              <td>{parseFloat(data.severe_wasting).toFixed(2)}</td>
              <td>{parseFloat(data.wasting).toFixed(2)}</td>
              <td>{parseFloat(data.overweight).toFixed(2)}</td>
              <td>{parseFloat(data.stunting).toFixed(2)}</td>
              <td>{parseFloat(data.underweight).toFixed(2)}</td>
              <td>{parseFloat(data.u5_population).toFixed(2)}</td>
              <td>
                <button className="data-list-button edit" onClick={() => handleEdit(data)}>
                  Edit
                </button>
                <button className="data-list-button delete" onClick={() => openDeleteModal(data.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
          Prev
        </button>
        {renderPageNumbers()}
        <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-button">
          Next
        </button>
      </div>


      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Data"
        className="modal edit-data-modal"
        overlayClassName="modal-overlay"
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Data</h2>
        <form onSubmit={handleUpdate} className="edit-data-form">
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                COUNTRY
              </label>
              <input
                type="text"
                value={editForm.country}
                onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                INCOME CLASSIFICATION
              </label>
              <input
                type="number"
                value={editForm.income_classification}
                onChange={(e) =>
                  setEditForm({ ...editForm, income_classification: e.target.value })
                }
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                SEVERE WASTING
              </label>
              <input
                type="number"
                value={editForm.severe_wasting}
                onChange={(e) => setEditForm({ ...editForm, severe_wasting: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                WASTING
              </label>
              <input
                type="number"
                value={editForm.wasting}
                onChange={(e) => setEditForm({ ...editForm, wasting: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                OVERWEIGHT
              </label>
              <input
                type="number"
                value={editForm.overweight}
                onChange={(e) => setEditForm({ ...editForm, overweight: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                STUNTING
              </label>
              <input
                type="number"
                value={editForm.stunting}
                onChange={(e) => setEditForm({ ...editForm, stunting: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                UNDERWEIGHT
              </label>
              <input
                type="number"
                value={editForm.underweight}
                onChange={(e) => setEditForm({ ...editForm, underweight: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                U5 POPULATION
              </label>
              <input
                type="number"
                value={editForm.u5_population}
                onChange={(e) => setEditForm({ ...editForm, u5_population: e.target.value })}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="submit">Update Data</button>
              <button type="button" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="modal delete-confirmation-modal"
        overlayClassName="modal-overlay"
      >
        <h2>Are you sure you want to delete this data?</h2>
        <p>This will delete this row permanently. You cannot undo this action.</p>
        <div className="modal-footer">
          <button onClick={closeDeleteModal}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default DengueDataList;
