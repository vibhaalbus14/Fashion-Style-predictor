import React from 'react'

const AdminNavbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Fashion Forward</div>
      <ul>
        <li>Home</li>
        <li>Products</li>
      </ul>
      <button className="logout-btn">Logout</button>
    </nav>
  );
}


export default AdminNavbar
