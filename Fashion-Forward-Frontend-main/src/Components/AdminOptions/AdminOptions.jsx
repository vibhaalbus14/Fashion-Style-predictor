import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminOptions.css";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-buttons">
        <button className="admin-button" onClick={() => navigate('/create')}>
          Create
        </button>
        <button className="admin-button" onClick={() => navigate('/read')}>
          Read
        </button>
        <button className="admin-button" onClick={() => navigate('/update')}>
          Update
        </button>
        <button className="admin-button" onClick={() => navigate('/delete')}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
