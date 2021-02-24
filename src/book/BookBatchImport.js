import React, { useState } from 'react';
import { Typography, Form, Button, Popconfirm, message } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import FileUpload from '../components/FileUpload';

const { Title } = Typography;

function BookBatchImport (props) {    
    const [form] = Form.useForm();  
    const [file, setFile] = useState();   

    function onFileUpload(file) {
        setFile(file)
    }

    function onFinish (values) {   
        var formData = new FormData();               
        formData.append('file', file);     
        formData.append('token', props.token);                          
        axios({
            method: 'POST',
            url: `${api.books}/`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}            
        })                   
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                message.info("Амжилттай бүртгэгдлээ.")   
            }                        
            form.resetFields()             
        })
        .catch(err => {                            
            message.error("Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.")
        })         
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Багц ном бүртгэх</Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>    
                <Form.Item name="file" label="Файл сонгох:">
                    <FileUpload onFileUpload={onFileUpload} />
                </Form.Item>            
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm title="Бүртгэхдээ итгэлтэй байна уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button type="primary" icon={<FileAddOutlined />} style={{ marginRight: '8px' }}>
                                Бүртгэх
                            </Button>
                        </Popconfirm>                            
                    </div>                                        
                </Form.Item>                                
            </Form>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(BookBatchImport);