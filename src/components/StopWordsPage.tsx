import { useEffect, useState } from "react"

type StopWord = {
    id: number,
    stop_word: string
}

export function StopWordsPage() {

    const [stopWords, setStopWords] = useState<StopWord[] | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => fetch("http://localhost:5000/stopword")
        fetchData()
            .then((res) => res.json())
            .then((json) => setStopWords(json))
    }, []);

    console.log(stopWords);

    return (
        <div>
            Töltelékszavak listája itt lesz kezelhető, de már fetch van.
        </div>
    )
}