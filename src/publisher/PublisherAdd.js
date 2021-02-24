import React from 'react';
import { Typography, Form, Input, Button, message, Popconfirm } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

function PublisherAdd(props) {

    const [form] = Form.useForm();

    function onFinish (values) {          
        const data = {
            "name": values.name,
            "description": values.description ? values.description : "",            
            "token": props.token
        }
        axios({
            method: 'POST',
            url: `${api.publishers}/`,
            data: data
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

    function onReset () {
        form.resetFields();
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Шинээр компани бүртгэх</Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та компанийн нэрийг оруулна уу!' }]}>
                    <Input placeholder="Нэпко" />
                </Form.Item>
                <Form.Item name="description" label="Тэмдэглэл:">
                    <TextArea rows={8} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>                        
                        <Popconfirm title="Тус компанийг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                Бүртгэх
                            </Button>
                        </Popconfirm>
                        <Button type="ghost" icon={<ReloadOutlined />} onClick={onReset} style={{ marginRight: '8px' }}>
                            Хоослох
                        </Button>                                
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

export default connect(mapStateToProps)(PublisherAdd);