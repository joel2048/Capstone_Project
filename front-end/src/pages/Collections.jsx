import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const fetchCollections = async () => {
  const {data} = await axios.get('http://localhost:3000/api/collections');
  return data;
};

function Collections() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: fetchCollections,
    })

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading collections</div>;
  return (
    <>
    <div>
        <div>
            <div>Total: {data.total}</div>
            Collections: {data.collections.map(collection => (
                <div >
                <p>{collection.collectionName}</p>
                <p>{collection.cardTotal}</p>
                </div>
            ))}
        </div>
    </div>
    </>
  );
}

export default Collections;
