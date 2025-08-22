import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import AddToCollection from "../components/AddToCollection";
import WordDetails from "../components/WordDetails";

function Dictionary() {
  const [query, setQuery] = useState(() => {
    // restore last query from localStorage
    return localStorage.getItem("query") || "";
  });

  const [selectedSlug, setSelectedSlug] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [storedResults, setStoredResults] = useState(() => {
    // restore last results from localStorage
    const stored = localStorage.getItem("results");
    return stored ? JSON.parse(stored) : [];
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["searchWords", query],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://proxy.corsfix.com/?https://jisho.org/api/v1/search/words?keyword=${query}`
      );
      const commonWords = data.data.filter((word) => word.is_common); //check if common word
      const jlptWords = commonWords.filter((word) => word.jlpt.length); //check if jlpt word

      return jlptWords; //data ^
    },
    enabled: false,
    staleTime: 1000 * 60 * 2,
  });

  // save query + results when they change
  useEffect(() => {
    if (query) {
      localStorage.setItem("query", query);
    }
  }, [query]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("results", JSON.stringify(data));
      setStoredResults(data);
    }
  }, [data]);

  const handleSearch = (value) => {
    setQuery(value);
    refetch();
  };

  const handleOpen = (slug) => {
    setSelectedSlug(slug);
    setShowAdd(true);
  };

  const handleClose = () => {
    setShowAdd(false);
    setSelectedSlug(null);
  };

  //handle detail page (... button) (if word info > 5)
  const [showWordDetail, setShowWordDetail] = useState(false);
  const handleWordDetail = (slug) => {
    setShowWordDetail((prev) => !prev);
    setSelectedSlug(slug);
  };

  const handleCloseWordDetail = () => {
    setSelectedSlug(null);
    setShowWordDetail((prev) => !prev);
  };

  // prefer query results
  const resultsToShow = data || storedResults;

  return (
    <div className="flex flex-col items-center h-screen p-4 justify-start">
      <SearchBar onEnter={handleSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading results</p>}

      <ul className="mt-4 w-full max-w-2xl">
        {resultsToShow.map((word) => (
          <>
            {/* word */}
            <li
              key={word.slug}
              className="flex items-center p-2 border-b space-x-2 relative"
            >
              <div className="items-center justify-center space-y-4 w-28">
                <p>{word.slug}</p>
                <p>{word.japanese[0].reading}</p>
              </div>
              <ul className="w-full">
                {word.senses.slice(0, 5).map((sense, index) => (
                  <li key={index}>
                    <p className="font-bold">
                      {index + 1}. {sense.parts_of_speech.join(", ")}
                    </p>
                    <p className="mb-2">
                      {sense.english_definitions.join(", ")}
                    </p>
                  </li>
                ))}
                {word.senses.length > 5 ? (
                  <button
                    className="my-button"
                    onClick={() => handleWordDetail(word.slug)}
                  >
                    ...
                  </button>
                ) : null}
              </ul>
              {/* open add component */}
              <button
                className="my-button absolute right-1 text-xs"
                onClick={() => handleOpen(word.slug)}
              >
                save
              </button>
            </li>
          </>
        ))}
      </ul>
      {/* add to - window */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-500 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="my-button absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleClose}
            >
              ✕
            </button>
            <AddToCollection selectedSlug={selectedSlug} />
          </div>
        </div>
      )}
      {/* word details window */}
      {showWordDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-500 p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="my-button absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleCloseWordDetail}
            >
              ✕
            </button>
            <WordDetails slug={selectedSlug} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dictionary;
