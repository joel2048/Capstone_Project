import { useQuery } from "react-query";
import axios from "axios";

function AddCollection({ slug, onClose }) {
  // fetch all collections
  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/collections");
      return data.collections;
    },
  });

  const handleAddToCollection = async (slug, collectionId) => {
    // fetch items for that collection
    const { data } = await axios.get(
      `http://localhost:3000/api/collections/cards/${collectionId}`
    );
    const items = data.collectionitems;

    // merge arrays
    if (!items.includes(slug)) {
      const newWordList = [...items, slug];

      try {
        await axios.post("http://localhost:3000/api/collections/edit", {
          collectionId,
          newWordList,
          newName: "", // if required by API
        });
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
      {collections.map((collection) => (
        <button
          key={collection.collectionId}
          onClick={() => handleAddToCollection(slug, collection.collectionId)}
          style={{ display: "block", margin: "0.2rem 0" }}
        >
          {collection.collectionName}
        </button>
      ))}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddCollection;