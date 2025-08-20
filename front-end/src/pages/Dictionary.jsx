import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SearchBar from "../components/SearchBar";

function Dictionary() {
  const [query, setQuery] = useState(() => {
    // restore last query from localStorage
    return localStorage.getItem("query") || "";
  });

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
      return data.data;
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
      setStoredResults(data); // update state
    }
  }, [data]);

  const handleSearch = (value) => {
    setQuery(value);
    refetch();
  };

  // prefer query results, fallback to stored results
  const resultsToShow = data || storedResults;

  return (
    <div>
      <SearchBar onEnter={handleSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading results</p>}
      {resultsToShow.map((word) => (<>
        <p key={word.slug}>{word.slug}</p><button>add</button>
        </>
      ))}
    </div>
  );
}

export default Dictionary;