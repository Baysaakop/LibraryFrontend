import React from 'react';
import { Typography, Form, Input, Button, message, Popconfirm } from 'antd';
import { FieldNumberOutlined, EditOutlined, ReloadOutlined, UserOutlined, MobileOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

function CustomerAdd(props) {

    const [form] = Form.useForm();

    function onFinish (values) {                          
        const data = {
            "code": values.code,
            "first_name": values.first_name,            
            "last_name": values.last_name,            
            "mobile": values.mobile,
            // "birthday": values.birthday ? moment(values.birthday).format("YYYY-MM-DD") : "",
            "description": values.description ? values.description : "",            
            "token": props.token
        }        
        axios({
            method: 'POST',
            url: `${api.customers}/`,
            data: data
        })            
        .then(res => {
            console.log(res)
            if (res.status === 200 || res.status === 201) {
                message.info("Амжилттай бүртгэгдлээ.")   
            }                        
            form.resetFields()             
        })
        .catch(err => {                                 
            if (err.message.toString().endsWith('409')) {
                message.error(`${values.code} код бүхий хэрэглэгч аль хэдийн бүртгэлтэй байна.`)
            } else {
                message.error("Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.")
            }            
        }) 
    }

    function onReset () {
        form.resetFields();
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Шинээр хэрэглэгч бүртгэх</Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>                
                <Form.Item name="code" label="SAP Код:" rules={[{ required: true, message: 'SAP код оруулна уу' }]}>
                    <Input prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} placeholder="1234567" />
                </Form.Item>
                <Form.Item name="last_name" label="Овог:" rules={[{ required: true, message: 'Хэрэглэгчийн овог оруулна уу!' }]}>
                    <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} placeholder="Дорж" />
                </Form.Item>
                <Form.Item name="first_name" label="Нэр:" rules={[{ required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' }]}>
                    <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} placeholder="Баяр" />
                </Form.Item>
                <Form.Item name="mobile" label="Утасны дугаар:" rules={[{ required: true, message: 'Та утасны дугаарыг заавал оруулна уу!' }]}>
                    <Input prefix={<MobileOutlined style={{ color: '#a1a1a1' }} />} placeholder="88888888" />
                </Form.Item>
                {/* <Form.Item name="birthday" label="Төрсөн өдөр:">
                    <DatePicker />
                </Form.Item> */}
                <Form.Item name="description" label="Тэмдэглэл:">
                    <TextArea rows={8} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>                        
                        <Popconfirm title="Тус хэрэглэгчийг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
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

export default connect(mapStateToProps)(CustomerAdd);