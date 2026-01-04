import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import NewCollection from "../components/NewCollection";

function Collections() {
  const [showNewCollection, setShowNewCollection] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const fetchCollections = async () => {
    try {
      const token = await getAccessTokenSilently({ audience: "VocabApp" });
      const { data } = await axios.get("http://localhost:3000/api/collections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading collections</div>;

  // Fallbacks because of undefined errors
  const collections = Array.isArray(data.collections) ? data.collections : [];

  return (
    <>
      <div className="flex flex-col items-center h-screen">
        {showNewCollection ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-500 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <NewCollection onClose={() => setShowNewCollection(false)} />
            </div>
          </div>
        ) : null}
        <div className="w-full max-w-4xl px-4">
          <div className="mt-5">Total Collections: {data.total}</div>
          <button className="my-button mt-2" onClick={() => setShowNewCollection(true)}>Create new collection</button>
          <p className="mt-2 font-bold">Collection list:</p>
          <ul className="mt-4 w-full">
            {collections.length > 0 ? (
            data.collections.map((collection) => (
              <Link
                className="collections mb-1"
                to={`/CardSwipe/${collection.collectionId}`}
              >
              <li key={collection.collectionId}>
                {/* collection name */}
                <p className="font-bold">{collection.collectionName}</p>
                <p>Number of Cards: {collection.cardTotal}</p>
              
              </li>
              </Link>
          
            ))) : (
              <p>No collections available</p>
            )}
          </ul>
          
        </div>
      </div>
    </>
  );
}

export default Collections;
