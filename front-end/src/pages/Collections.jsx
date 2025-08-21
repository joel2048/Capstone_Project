import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function Collections() {
  const { getAccessTokenSilently } = useAuth0();
  const fetchCollections = async () => {
  const token = await getAccessTokenSilently({
  audience: "VocabApp",
});
    console.log(token)
    const { data } = await axios.get("http://localhost:3000/api/collections",  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
    );
    return data;
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading collections</div>;
  return (
    <>
      <div>
        <div>
          <div>Total: {data.total}</div>
          Collections:{" "}
          {data.collections.map((collection) => (
            <Link to={`/CardSwipe/${collection.collectionId}`}
              key={collection.collectionId}
              onClick={() =>
                handleAddToCollection(selectedSlug, collection.collectionId)
              }
              style={{ display: "block", margin: "0.2rem 0" }}
            >
              <p>{collection.collectionName}</p>
              <p>{collection.cardTotal}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Collections;
