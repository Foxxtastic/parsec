import { Button, Table } from "antd";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getData } from "../helpers/fetchFunctions";

type StopWord = {
    id: number,
    stop_word: string
}

let dataSource: any;
const colums = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
    },
    {
        title: 'Töltelékszó',
        dataIndex: 'stop_word',
        key: 'stop_word'
    },
    {
        title: '',
        key: 'edit',
        dataIndex: 'edit',
        width: '10%',
        render: (record: any) => (
            <button onClick={() => console.log(record)}>
                {"Szerkesztés"}
            </button>
        ),
    },
    {
        title: '',
        key: 'delete',
        dataIndex: 'delete',
        width: '10%',
        render: (record: any) => (
            <button onClick={() => console.log(record)}>
                {"Törlés"}
            </button>
        ),
    },
]

export function StopWordsPage() {

    const navigate = useNavigate()
    const [stopWords, setStopWords] = useState<StopWord[] | undefined>(undefined);

    useEffect(() => {
        getData("http://localhost:5000/stopword")
            .then((json) => setStopWords(json));
    }, []);

    useEffect(() => {
        if (stopWords !== undefined) {
            dataSource = stopWords.map((_, idx) => ({
                ..._,
                key: idx
            }))
        }
    }, [stopWords]);

    return (
        <div className="content">
            {stopWords && dataSource &&
                <>
                    <Table dataSource={dataSource} columns={colums} rowKey={dataSource.key} />
                    <Button style={{ float: 'right' }} onClick={() => navigate('./add')}>Új</Button>
                </>}
        </div>
    )
}