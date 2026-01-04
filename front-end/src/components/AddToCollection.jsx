import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function AddToCollection({ selectedSlug }) {
  const {
    getAccessTokenSilently
  } = useAuth0();

  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      try {
        const token = await getAccessTokenSilently({ audience: "VocabApp" });
        const { data } = await axios.get("http://localhost:3000/api/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data.collections;
      } catch (err) {
        console.error("Failed to fetch collections", err);
        return [];
      }
    },
  });

  const handleAddToCollection = async (slug, collectionId) => {
    try {
      const token = await getAccessTokenSilently({ audience: "VocabApp" });

      const { data } = await axios.get(
        `http://localhost:3000/api/collections/cards/${collectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = data.collectionitems;
      const cleanedItems = items.map((item) => {
        if (typeof item === "string") {
          try {
            const parsed = JSON.parse(item);
            return parsed?.slug ?? parsed;
          } catch {
            return item.replace(/^"|"$/g, "");
          }
        }
        return item.slug ?? String(item);
      });

      if (!cleanedItems.includes(slug)) {
        const newWordList = [...cleanedItems, slug];
        await axios.post(
          "http://localhost:3000/api/collections/edit",
          { collectionId, newWordList },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Added ${slug} to collection ${collectionId}`);
      } else {
        alert(`${slug} already exists in this collection`);
      }
    } catch (err) {
      console.error("Failed to add to collection", err);
      alert("Failed to add to collection");
    }
  };

  if (isLoading) return <p>Loading collections...</p>;
  if (error) return <p>Failed to load collections</p>;

  if (collections.length > 0) return (
    <div>
      <p>Select collection:</p>
      {collections
        .filter((collection) => ![1, 2, 3].includes(collection.collectionId))
        .map((collection) => (
          <button
            type="button" 
            className="my-button"
            key={collection.collectionId}
            onClick={() =>
              handleAddToCollection(selectedSlug, collection.collectionId)
            }
            style={{ display: "block" }}
          >
            {collection.collectionName}
          </button>
        ))}
    </div>
  );
}

export default AddToCollection;
