import '../index.css'
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchMore = async () => {
    const {data} = await axios.get(`https://jisho.org/api/v1/search/words?slug=${slug}`)
    return data;
};

function WordDetails(slug) {
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['word'],
        queryFn: fetchMore,
        enabled: false,
    });

    return(
        <div>
            {data.data[0].senses.map(sense => (
                <div key={sense}>
                {sense}
                </div>
            ))
            }
        </div>
    )
}

export default WordDetails;