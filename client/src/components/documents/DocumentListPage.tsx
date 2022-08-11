import { Button, message, Spin, Upload, UploadProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react";
import { createFile, deleteData, getAllData, getData } from "../../helpers/fetchFunctions";
import { TextComponent } from "./TextComponent";
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from "antd/lib/upload";
import { MyDocument, TXTFile } from "../../types/types";

const beforeUpload = (file: RcFile) => {
    const isTxt = file.type === 'text/plain';   //only txt is uploadable yet.
    if (!isTxt) {
        message.error('Csak txt fájl tölthető fel!');
    }
    return isTxt
};

export function DocumentListPage() {
    const [documents, setDocuments] = useState<MyDocument[] | undefined>(undefined);
    const [file, setFile] = useState<TXTFile | undefined>(undefined);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        getAllDocuments();
    }, []);

    const getAllDocuments = () => {
        setIsloading(true);
        getAllData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/document")
            .then(res => setDocuments(res))
            .finally(() => setIsloading(false))
    }

    const getDocumentById = (id: number) => {
        setIsloading(true);
        getData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/document", id)
            .then(res => setFile(res))
            .finally(() => setIsloading(false))

    }

    const uploadFile = (file: RcFile) => {
        setIsloading(true);
        createFile("https://dolphin-app-e3wt6.ondigitalocean.app/backend/document", file)
            .then(res => console.log(res))
            .finally(() => {
                getAllDocuments();
                setIsloading(false);
            })
    };

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

    const columns: ColumnsType<MyDocument> = [
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
            render: (_text: any, record: MyDocument) => (
                <button onClick={(e: any) => {
                    e.stopPropagation();
                    deleteData("https://dolphin-app-e3wt6.ondigitalocean.app/backend/document", record.id)
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
        <div className="content">
            {isloading ?
                <Spin /> :
                file ?
                    <TextComponent name={file.file_name} sentences={file.sentences} onClose={() => setFile(undefined)} /> :
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
                            pagination={false}
                        />
                        <Upload {...props} className="upload-component">
                            <Button icon={<UploadOutlined />}>Szövegfájl feltöltése</Button>
                        </Upload>
                    </>
            }
        </div>
    )
}