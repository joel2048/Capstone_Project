import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import WordDetails from "../components/WordDetails";

// shuffle function
function shuffleArray(array = []) {
  return [...array].sort(() => Math.random() - 0.5);
}

//page
function CardSwipe() {
  const { collectionId } = useParams()

  const fetchWords = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/api/collections/cards_detail/${collectionId}`
    );
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchWords,
  });

  // Initialize shuffledItems
  const [shuffledItems, setShuffledItems] = useState(() => {
    const saved = localStorage.getItem(`shuffledItems-${collectionId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // When data arrives, only shuffle if we don't have saved state
  useEffect(() => {
    if (data?.collectionItemsWithWords?.length > 0 && shuffledItems.length === 0) {
      const shuffled = shuffleArray(data.collectionItemsWithWords);
      setShuffledItems(shuffled);
      localStorage.setItem(`shuffledItems-${collectionId}`, JSON.stringify(shuffled));
    }
  }, [data]);

  // Save shuffledItems whenever it changes
  useEffect(() => {
    if (shuffledItems.length > 0) {
      localStorage.setItem(`shuffledItems-${collectionId}`, JSON.stringify(shuffledItems));
    }
  }, [shuffledItems, collectionId]);

  const [showWordDetail, setShowWordDetail] = useState(false);
  const handleWordDetail = () => {
    setShowWordDetail((prev) => !prev);
  };

  const handleSwipeLeft = () => {
    // Send data to the backend via POST
    axios.post("http://localhost:3000/api/collections/swipe_left", {
      
            "userId": 1, 
            "slug": shuffledItems[cardCounter].slug
        ,
    });
  };

    const handleSwipeRight = () => {
    // Send data to the backend via POST
    axios.post("http://localhost:3000/api/collections/swipe_right", {
      
            "userId": 1, 
            "slug": shuffledItems[cardCounter].slug
        ,
    });
    };

  const [side, setSide] = useState(true); //true is front side
  
  //position in collection
  const [cardCounter, setCardCounter] = useState(() => {
    const saved = localStorage.getItem(`cardCounter-${collectionId}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  //save position in localstorage
  useEffect(() => {
    const saved = localStorage.getItem(`cardCounter-${collectionId}`);
    setCardCounter(saved ? parseInt(saved, 10) : 0);
  }, [collectionId]);

  useEffect(() => {
    localStorage.setItem(`cardCounter-${collectionId}`, cardCounter);
  }, [cardCounter, collectionId]);

  const cardTurn = () => {
    setSide(!side);
  };

  const nextCard = () => {
    if (cardCounter + 1 >= shuffledItems.length) {
      // reached the last card
      setShuffledItems(shuffleArray(data.collectionItemsWithWords));
      setCardCounter(0);
      setShowWordDetail(false);
      setSide(true);
    } else {
      setCardCounter(cardCounter + 1);
      setShowWordDetail(false);
      setSide(true);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flashcards</div>;
  return (
    <>
    {shuffledItems.length > 0 && (
    <>
      <div>
        {side ? (
          <>
            <p>
              Card Content Front:{" "}
              {shuffledItems[cardCounter].slug}
            </p>
          </>
        ) : (
          <>
            <p>
              Card Content Back:{" "}
              {shuffledItems[cardCounter].Word.kana}
            </p>
          </>
        )}
        <button onClick={cardTurn}>Turn</button>
        <button onClick={nextCard}>Next</button>
        <button onClick={handleSwipeLeft}>Swipe Left</button>
        <button onClick={handleSwipeRight}>Swipe Right</button>
        <button onClick={handleWordDetail}>more</button>
        {showWordDetail ? (
          <WordDetails slug={shuffledItems[cardCounter].slug} />
        ) : null}
      </div>
      <div>
        <p>All Cards:</p>
        {shuffledItems.map((word) => (
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
      
    </>
    )}
    </>
  );
}

export default CardSwipe;
