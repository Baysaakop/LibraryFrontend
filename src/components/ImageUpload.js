import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import './ImageUpload.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ImageUpload = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {        
        console.log(props.image)
        setImageUrl(props.image)
    }, [props.image]);

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }

    function handleChange(info) {        
        setLoading(true);        
        if (info.file.type === 'image/jpeg' || info.file.type === 'image/png') {            
            getBase64(info.file, imageUrl => 
                setImageUrl(imageUrl),
                props.onImageSelected(info.file)
            );
            // setImage(info.file);
            // props.onImageSelected(info.file);
        }
        else {            
            message.error('You can only upload JPG/PNG file!');     
        }              
        setLoading(false);           
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Upload
            name="image"
            multiple={false}
            listType="picture-card"
            className="image-uploader"
            showUploadList={false}            
            beforeUpload={() => false}
            onChange={handleChange}
        >
            {imageUrl ? <img src={imageUrl} alt="upload" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    );
};

export default ImageUpload;