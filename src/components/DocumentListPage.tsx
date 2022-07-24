import { Button, message, Spin, Upload, UploadProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react";
import { createFile, deleteData, getAllData, getData } from "../helpers/fetchFunctions";
import { Buffer } from 'buffer';
import { TextComponent } from "./TextComponent";
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from "antd/lib/upload";

type Document = {
    id: number,
    fileName: string,
    upLoaded: string
}

type File = {
    name: string,
    content: string
}


const beforeUpload = (file: RcFile) => {
    const isTxt = file.type === 'text/plain';   //only txt is uploadable yet.
    if (!isTxt) {
        message.error('Csak txt fájl tölthető fel!');
    }
    return isTxt
};

export function DocumentListPage() {
    const [documents, setDocuments] = useState<Document[] | undefined>(undefined);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        getAllDocuments();
    }, []);

    const getAllDocuments = () => {
        setIsloading(true);
        getAllData("http://localhost:5000/document")
            .then(res => setDocuments(res))
            .finally(() => setIsloading(false))
    }

    const getDocumentById = (id: number) => {
        setIsloading(true);
        getData("http://localhost:5000/document", id)
            .then(res => getFileContent(res[0]))
            .finally(() => setIsloading(false))

    }

    const uploadFile = (file: RcFile) => {
        setIsloading(true);
        createFile("http://localhost:5000/document", file)
            .then(res => console.log(res))
            .finally(() => {
                getAllDocuments();
                setIsloading(false);
            })
    };

    const getFileContent = (file: any) => {
        const loadedFile: File = {
            name: file.file_name,
            content: Buffer.from(file.encode, "base64").toString()
        }
        setFile(loadedFile);
    }

    const props: UploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        showUploadList: false,

        beforeUpload: beforeUpload,

        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                uploadFile(info.file.originFileObj as RcFile);
            }
            else if (info.file.status === 'error') {
                message.error(`${info.file.name} sikertelen feltöltés.`);
            }
        }
    }

    const columns: ColumnsType<Document> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '5%'
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
        },
        {
            title: '',
            key: 'delete',
            dataIndex: 'delete',
            width: '10%',
            render: (_text: any, record: Document) => (
                <button onClick={(e: any) => {
                    e.stopPropagation();
                    deleteData("http://localhost:5000/document", record.id)
                        .then((res) => console.log(res))
                        .finally(() => {
                            setIsloading(true)
                            getAllDocuments();
                        })
                }}>
                    {"Törlés"}
                </button >
            ),
        }
    ]

    return (
        <div>
            {isloading ?
                <Spin /> :
                file ?
                    <TextComponent name={file.name} content={file.content} /> :
                    <>
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
                        <Upload {...props} className="upload_component">
                            <Button icon={<UploadOutlined />}>Szövegfájl feltöltése</Button>
                        </Upload>
                    </>
            }
        </div>
    )
}