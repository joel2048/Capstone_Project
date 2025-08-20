import "../index.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function WordDetails(props) {
  const fetchMore = async () => {
    const { data } = await axios.get(
      `https://proxy.corsfix.com/?https://jisho.org/api/v1/search/words?slug=${props.slug}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );
    return data;
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["detail", props.slug],
    queryFn: fetchMore,
    enabled: !!props.slug,
  });
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading details</div>;
  return (
    <div>
      {data.data[0].senses.map((sense, index) => (
        <div key={index}>
          <p>
            <strong>Part of speech:</strong> {sense.parts_of_speech.join(", ")}
          </p>
          <p>
            <strong>Definitions:</strong> {sense.english_definitions.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WordDetails;
