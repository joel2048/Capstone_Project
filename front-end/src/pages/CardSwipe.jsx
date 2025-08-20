import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import WordDetails from "../components/WordDetails";

const collectionId = 2;

const fetchWords = async () => {
  const { data } = await axios.get(
    `http://localhost:3000/api/collections/cards_detail/${collectionId}`
  );
  return data;
};

function CardSwipe() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchWords,
  });

  const [showWordDetail, setShowWordDetail] = useState(false);
  const handleWordDetail = () => {
    setShowWordDetail((prev) => !prev);
  };

  const handleSwipeLeft = () => {
    // Send data to the backend via POST
    axios.post("http://localhost:3000/api/collections/swipe_left", {
      
            "userId": 1, 
            "slug": data.collectionItemsWithWords[cardCounter].slug
        ,
    });
  };

    const handleSwipeRight = () => {
    // Send data to the backend via POST
    axios.post("http://localhost:3000/api/collections/swipe_right", {
      
            "userId": 1, 
            "slug": data.collectionItemsWithWords[cardCounter].slug
        ,
    });
    };

  const [side, setSide] = useState(true); //true is front side

  const [cardCounter, setCardCounter] = useState(() => {
    const saved = localStorage.getItem(`cardCounter-${collectionId}`);
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    localStorage.setItem(`cardCounter-${collectionId}`, cardCounter);
  }, [cardCounter, collectionId]);

  const cardTurn = () => {
    setSide(!side);
  };

  const nextCard = () => {
    setCardCounter(cardCounter + 1);
    setSide(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flashcards</div>;
  return (
    <>
      <div>
        {side ? (
          <>
            <p>
              Card Content Front:{" "}
              {data.collectionItemsWithWords[cardCounter].slug}
            </p>
          </>
        ) : (
          <>
            <p>
              Card Content Back:{" "}
              {data.collectionItemsWithWords[cardCounter].Word.kana}
            </p>
          </>
        )}
        <button onClick={cardTurn}>Turn</button>
        <button onClick={nextCard}>Next</button>
        <button onClick={handleSwipeLeft}>Swipe Left</button>
        <button onClick={handleSwipeRight}>Swipe Right</button>
        <button onClick={handleWordDetail}>more</button>
        {showWordDetail ? (
          <WordDetails slug={data.collectionItemsWithWords[cardCounter].slug} />
        ) : null}
      </div>
      <div>
        <p>All Cards:</p>
        {data.collectionItemsWithWords.map((word) => (
          <div key={word.slug}>
            <p>{word.slug}</p>
          </div>
        ))}
      </div>

      <div>
        <p>CardSwipe</p>
        <img
          src="card_placeholder.png"
          width="100"
          height="100"
          alt="placeholder"
        ></img>
      </div>
      <button>left</button>
      <button>right</button>
    </>
  );
}

export default CardSwipe;
