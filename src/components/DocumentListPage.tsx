import { Spin } from "antd";
import Table, { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react";
import { getAllData, getData } from "../helpers/fetchFunctions";
import { Buffer } from 'buffer';
import { TextComponent } from "./TextComponent";

type Document = {
    id: number,
    fileName: string,
    upLoaded: string
}

type File = {
    name: string,
    content: string
}

const columns: ColumnsType<Document> = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Fájlnév',
        dataIndex: 'file_name',
        key: 'fileName',
    },
    {
        title: 'Feltöltve',
        dataIndex: 'uploaded',
        key: 'upLoaded',
    }
]

export function DocumentListPage() {
    const [documents, setDocuments] = useState<Document[] | undefined>(undefined);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        setIsloading(true);
        getAllData("http://localhost:5000/document")
            .then(res => setDocuments(res))
            .finally(() => setIsloading(false))
    }, []);

    const getFileContent = (file: any) => {
        const loadedFile: File = {
            name: file.file_name,
            content: Buffer.from(file.encode, "base64").toString()
        }
        setFile(loadedFile);
    }

    const getDocumentById = (id: number) => {
        setIsloading(true);
        getData("http://localhost:5000/document", id)
            .then(res => getFileContent(res[0]))
            .finally(() => setIsloading(false))
    }

    return (
        <div>
            {isloading ?
                <Spin /> :
                file ?
                    <TextComponent name={file.name} content={file.content} /> :
                    <Table
                        rowKey="id"
                        bordered
                        columns={columns}
                        dataSource={documents}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => { getDocumentById(record.id) }, // click row
                            };
                        }}
                    />
            }

        </div>
    )
}