// work in progress
import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const DeleteCollection = ({ onClose, onCreated, props }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [collectionName, setCollectionName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setLoading(true);
    setError("");

    try {
      const token = await getAccessTokenSilently({
        audience: "VocabApp",
        });

      const res = await axios.delete(
        "http://localhost:3000/api/collections/delete",
        {
        collectionId: props.collectionId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
        <h3>Delete Collection</h3>
        {error && <p>{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
      </div>
    </div>
  );
};

export default DeleteCollection;