import { UploadOutlined } from '@ant-design/icons';
import { Spin, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { createFile } from '../helpers/fetchFunctions';

const beforeUpload = (file: RcFile) => {
    const isTxt = file.type === 'text/plain';   //only txt is uploadable yet.
    if (!isTxt) {
        message.error('Csak txt fájl tölthető fel!');
    }
    return isTxt
};

export function FileUploadPage() {

    const [isloading, setIsloading] = useState(false);

    const uploadFile = (file: RcFile) => {
        setIsloading(true);
        createFile("http://localhost:5000/document", file)
            .then(res => console.log(res))
            .finally(() => setIsloading(false))
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

    return (
        <div className='fileuploadpage'>
            {isloading ?
                <Spin /> :
                <>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Szövegfájl feltöltése</Button>
                    </Upload>
                </>}
        </div >
    )

}