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

          <ul>
          {data.data[0].senses.map((sense, index) => (
            <li key={index}>
              <p className="font-bold">{index+1}. {sense.parts_of_speech.join(", ")}</p>
              <p className="mb-2">{sense.english_definitions.join(", ")}</p>
            </li>
          ))}
          </ul>

    </div>
  );
}

export default WordDetails;
