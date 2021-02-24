import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

const { Dragger } = Upload;

function FileUpload (props) {

    function onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
            props.onFileUpload(info.file)   
        }
    }

    return (
        <Dragger
            name="file"
            onChange={onChange}
        >
            <p className="ant-upload-drag-icon">
            <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
            </p>
        </Dragger>
    )   
}

export default FileUpload;