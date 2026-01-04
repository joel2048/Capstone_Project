import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import TinderCard from "react-tinder-card";

import axios from "axios";

import WordDetails from "../components/WordDetails";

// shuffle function
function shuffleArray(array = []) {
  return [...array].sort(() => Math.random() - 0.5);
}

//page
function CardSwipe() {
  const { getAccessTokenSilently } = useAuth0();
  const { collectionId } = useParams();

  const fetchWords = async () => {
    const token = await getAccessTokenSilently({
      audience: "VocabApp",
    });
    const { data } = await axios.get(
      `http://localhost:3000/api/collections/cards_detail/${collectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["cards", collectionId],
    queryFn: fetchWords,
  });

  // Initialize shuffledItems
  const [shuffledItems, setShuffledItems] = useState(() => {
    const saved = localStorage.getItem(`shuffledItems-${collectionId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Initialize position in collection
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

  // When data arrives, only shuffle if we don't have saved state
  useEffect(() => {
    if (
      data?.collectionItemsWithWords?.length > 0 &&
      shuffledItems.length === 0
    ) {
      const shuffled = shuffleArray(data.collectionItemsWithWords);
      setShuffledItems(shuffled);
      localStorage.setItem(
        `shuffledItems-${collectionId}`,
        JSON.stringify(shuffled)
      );
    }
  }, [data]);

  // Save shuffledItems whenever it changes
  useEffect(() => {
    if (shuffledItems.length > 0) {
      localStorage.setItem(
        `shuffledItems-${collectionId}`,
        JSON.stringify(shuffledItems)
      );
    }
  }, [shuffledItems, collectionId]);

  const [showWordDetail, setShowWordDetail] = useState(false);
  const handleWordDetail = () => {
    setShowWordDetail((prev) => !prev);
  };

  const handleSwipeLeft = async () => {
    const token = await getAccessTokenSilently({
      audience: "VocabApp",
    });
    // Send data to the backend via POST
    axios.post(
      "http://localhost:3000/api/collections/swipe_left",
      {
        slug: shuffledItems[cardCounter].slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleSwipeRight = async () => {
    const token = await getAccessTokenSilently({
      audience: "VocabApp",
    });
    // Send data to the backend via POST
    axios.post(
      "http://localhost:3000/api/collections/swipe_right",
      {
        slug: shuffledItems[cardCounter].slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const [side, setSide] = useState(true); //true is front side

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

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(0); // 0=left 1=right

  const handleAnimationDirection = (direction) => {
    setAnimationDirection(direction);
    setAnimate(true);
  };

  const handleAnimationEnd = () => {
    setAnimate(false);
    nextCard();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flashcards</div>;
  return (
    <>
      {shuffledItems.length > 0 && (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div
              className={`w-64 h-40 bg-stone-500 p-6 rounded-xl shadow relative
    ${animate && animationDirection === 0 ? "card-swipe-left" : ""}
    ${animate && animationDirection === 1 ? "card-swipe-right" : ""}`}
              onAnimationEnd={handleAnimationEnd}
              onClick={cardTurn}
            >
              <div className="relative w-full h-full">
                <div>
                  {side ? (
                    shuffledItems[cardCounter].slug
                  ) : (
                    <>
                      {shuffledItems[cardCounter].Word?.kana} <br />
                      {shuffledItems[cardCounter].Word.meaning.join(", ")}
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordDetail();
                  }}
                  className="my-button absolute bottom-2 right-2"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="left-button"
                onClick={() => {
                  handleSwipeLeft();
                  handleAnimationDirection(0);
                }}
                disabled={animate} //disable the button during animation to prevent multiple requests
              >
                Don't know
              </button>
              <button
                className="right-button"
                onClick={() => {
                  handleSwipeRight();
                  handleAnimationDirection(1);
                }}
                disabled={animate} //disable the button during animation to prevent multiple requests
              >
                Know
              </button>
            </div>

            {/* word details */}
            {showWordDetail && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-stone-500 p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
                  {/* Close button */}
                  <button
                    className="my-button absolute top-2 right-2 text-gray-600 hover:text-black"
                    onClick={() => setShowWordDetail(false)}
                  >
                    ✕
                  </button>
                  <WordDetails slug={shuffledItems[cardCounter].slug} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CardSwipe;
