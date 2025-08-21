import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function AddToCollection({ selectedSlug, onClose }) {
  const { getAccessTokenSilently } = useAuth0();
  // fetch all collections
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const token = await getAccessTokenSilently({
        audience: "VocabApp",
      });
      const { data } = await axios.get(
        "http://localhost:3000/api/collections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.collections;
    },
  });

  const handleAddToCollection = async (slug, collectionId) => {
    const token = await getAccessTokenSilently({
      audience: "VocabApp",
    });
    // fetch items for that collection
    let id = parseInt(collectionId);
    const { data } = await axios.get(
      `http://localhost:3000/api/collections/cards/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const items = data.collectionitems;
    //because it's stringyfied i got some request errors:
    const cleanedItems = items.map((item) => {
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === "object" && "slug" in parsed) {
            return parsed.slug;
          }
          return parsed; // if it's just a string
        } catch {
          return item.replace(/^"|"$/g, ""); // remove quotes around simple strings
        }
      }
      return item.slug ?? String(item); // if item is already an object
    });
    console.log(cleanedItems.map((s) => JSON.stringify(s)));
    const slugs = items.map((item) => item.slug);
    // merge arrays
    if (!slugs.includes(slug)) {
      const newWordList = [...cleanedItems, String(slug)];
      console.log(newWordList.map((s) => JSON.stringify(s)));

      try {
        const token = await getAccessTokenSilently({
          audience: "VocabApp",
        });
        await axios.post(
          "http://localhost:3000/api/collections/edit",
          {
            collectionId,
            newWordList,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(`Added ${slug} to collection ${collectionId}`);
      } catch (err) {
        console.error(err);
        alert("Failed to add");
      }
    } else {
      alert(`${slug} already exists in this collection`);
    }
  };

  if (isLoading) return <p>Loading collections...</p>;
  if (error) return <p>Failed to load collections</p>;

  return (
    <div>
      <p>Select collection:</p>
      {!collections ? (
        <p>Loading collections...</p>
      ) : (
        collections
          .filter((collection) => ![1, 2, 3].includes(collection.collectionId))
          .map((collection) => (
            <button
              key={collection.collectionId}
              onClick={() =>
                handleAddToCollection(selectedSlug, collection.collectionId)
              }
              style={{ display: "block" }}
            >
              {collection.collectionName}
            </button>
          ))
      )}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddToCollection;
