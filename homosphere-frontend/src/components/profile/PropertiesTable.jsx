import React from "react";

export default function PropertiesTable({ properties, page, pageSize, total, onPageChange, onView, onEdit, onDelete }) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="properties-table-wrapper">
      <table className="properties-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Price</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>No properties found.</td>
            </tr>
          ) : (
            properties.map((p) => (
              <tr key={p.id}>
                <td>{p.title || "Untitled"}</td>
                <td>{p.property?.type || p.type || "-"}</td>
                <td>{p.status?.replace(/_/g, " ") || "-"}</td>
                <td>{typeof p.price === "number" ? p.price.toLocaleString() : parseFloat(p.price || 0).toLocaleString()}</td>
                <td>{p.property?.location?.city || p.city || "-"}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => onView(p)}>View</button>
                  <button className="action-btn edit-btn" onClick={() => onEdit(p)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => onDelete(p.propertyListingId)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>&lt;</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>&gt;</button>
      </div>
    </div>
  );
}
