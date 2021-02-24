import React, { useState } from 'react';
import { Typography, Row, Col, Spin, Form, Input, Button, Select, message, Popconfirm } from 'antd';
import { FieldNumberOutlined, UserOutlined, MobileOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api';
import axios from 'axios';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function CustomerDelete (props) {

    const [form] = Form.useForm();   
    const [loading, setLoading] = useState(false); 
    const [customers, setCustomers] = useState();     
    const [selection, setSelection] = useState();        

    function onCustomerSearch(value) {                
        setLoading(true)         
        axios({
            method: 'GET',
            url: api.customers + "?search=" + value
        })
        .then(res => {                        
            setCustomers(res.data.results);     
            setLoading(false)       
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectCustomer (value) {                        
        const target = customers.find(x => x.id === parseInt(value))
        form.setFieldsValue({
            code: target.code,                
            first_name: target.first_name,
            last_name: target.last_name,
            mobile: target.mobile,                
            description: target.description
        })        
        setSelection(target)
    }

    function onFinish (values) {
        if (selection) {
            axios({
                method: 'DELETE',
                url: `${api.customers}/${selection.id}/`                
            })            
            .then(res => {
                console.log(res)
                if (res.status === 200 || res.status === 204) {
                    message.info("Сонгосон хэрэглэгчийг устгалаа.")                       
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                message.error("Устгаж чадсангүй. Та дахин оролдоно уу.")
            }) 
        } else {
            message.warning("Та эхлээд устгах хэрэглэгчээ сонгоно уу!")
        }               
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Хэрэглэгч устгах</Title>            
            <Row gutter={16}>
                 <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Хэрэглэгч хайх:</p>    
                    <Search placeholder="Хэрэглэгчийн SAP кодыг бичиж хайна уу" onSearch={onCustomerSearch} enterButton />                     
                </Col>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Хэрэглэгч сонгох:</p>    
                    { loading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (
                        <Select
                            showSearch                        
                            style={{ width: '100%', marginBottom: '24px' }}
                            placeholder="Хэрэглэгч сонгоно уу"                
                            onSelect={selectCustomer}
                            optionFilterProp="children"
                        >
                            { customers ? (
                                <>
                                    {customers.map(item => {
                                        return (
                                            <Option key={item.id}>{item.code} /{item.last_name} {item.first_name}/</Option>
                                        )
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Select>
                    )}                    
                </Col>
            </Row>
            { selection ? (
                <Form 
                    layout="vertical" 
                    form={form}                 
                    onFinish={onFinish}
                >                    
                    <Form.Item name="code" label="SAP Код:">
                        <Input prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} disabled />
                    </Form.Item>
                    <Form.Item name="last_name" label="Овог:">
                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} disabled />
                    </Form.Item>
                    <Form.Item name="first_name" label="Нэр:">
                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} disabled />
                    </Form.Item>
                    <Form.Item name="mobile" label="Утасны дугаар:">
                        <Input prefix={<MobileOutlined style={{ color: '#a1a1a1' }} />} disabled />
                    </Form.Item>
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} disabled />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус хэрэглэгчийн мэдээллийг устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button danger type="primary" icon={<DeleteOutlined />} style={{ marginRight: '8px' }}>
                                    Устгах
                                </Button>
                            </Popconfirm>                                                                               
                        </div>                                        
                    </Form.Item>         
                </Form>
            ) : (
                <></>
            )}            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(CustomerDelete);