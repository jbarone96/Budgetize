import React, { useState } from "react";
import "./Modify.css";

const Modify = ({ transaction, onSave, onCancel, onDelete }) => {
  const [editTransaction, setEditTransaction] = useState();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editTransaction);
  };

  const handleDelete = () => {
    onDelete(editTransaction);
  };

  return (
    <div className="modal container">
      <div className="modal-content">
        <h3>Edit or Delete Transaction</h3>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="custom-input"
            value={editTransaction.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            className="custom-input"
            value={editTransaction.amount}
            onChange={handleChange}
          />
        </div>
        <div className="modal-button">
          <button className="btn btn-blue" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-blue" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-red" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modify;
