// NewCollection.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const NewCollection = ({ onClose, onCreated }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [collectionName, setCollectionName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!collectionName) return;

    setLoading(true);
    setError("");

    try {
      const token = await getAccessTokenSilently({
        audience: "VocabApp",
        });

      const res = await axios.post(
        "http://localhost:3000/api/collections/new",
        {
        wordList: [],
        name: collectionName,
      },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onCreated) onCreated(res.data);

      setCollectionName("");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h3>Create New Collection</h3>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCollection;