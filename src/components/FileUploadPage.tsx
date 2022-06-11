import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { TextComponent } from './TextComponent';

const beforeUpload = (file: RcFile) => {
    const isTxt = file.type === 'text/plain';   //only txt is uploadable yet.
    if (!isTxt) {
        message.error('Csak txt fájl tölthető fel!');
    }
    return isTxt
};

const getFileContent = (txt: RcFile, callback: (content: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsText(txt, 'utf-8');
};

export function FileUploadPage() {

    const [fileContent, setFileContent] = useState<string | null>(null)

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
                getFileContent(info.file.originFileObj as RcFile, content => {
                    setFileContent(content);
                });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} sikertelen feltöltés.`);
            }
        }
    }

    return (
        <div className='fileuploadpage'>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Szövegfájl feltöltése</Button>
            </Upload>

            <TextComponent content={fileContent ? fileContent : null} />
        </div >
    )

}