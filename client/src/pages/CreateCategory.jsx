import React, { useState } from "react";
import { categoryService } from "../service/api";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) {
        setMessage("Category name is required");
        return;
      }

      await categoryService.createCategory({ name });
      setMessage(" Category created successfully");

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage(" Error creating category");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "21px" }}>
      <h2>Create Category</h2>

      <form onSubmit={handleSubmit}>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Add Category
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
};

export default CreateCategory;