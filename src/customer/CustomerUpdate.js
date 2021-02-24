import React, { useState } from 'react';
import { Typography, Row, Col, Spin, Form, Input, Button, Select, message, Popconfirm } from 'antd';
import { FieldNumberOutlined, UserOutlined, MobileOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function CustomerUpdate (props) {

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
            const data = {                                
                "last_name": values.last_name,
                "first_name": values.first_name,
                "mobile": values.mobile,                
                "description": values.description,            
                "token": props.token
            }
            axios({
                method: 'PUT',
                url: `${api.customers}/${selection.id}/`,
                data: data
            })            
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    message.info("Амжилттай засварлалаа.")   
                }                        
                form.resetFields()                             
            })
            .catch(err => {                            
                message.error("Засвар амжилтгүй боллоо. Та дахин оролдоно уу.")
            })  
        } else {
            message.warning("Та эхлээд засварлах хэрэглэгчээ сонгоно уу!")
        }               
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Хэрэглэгч засварлах</Title>                      
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
                    <Form.Item name="code" label="SAP Код:" rules={[{ required: true, message: 'SAP код оруулна уу' }]}>
                        <Input prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} disabled />
                    </Form.Item>
                    <Form.Item name="last_name" label="Овог:" rules={[{ required: true, message: 'Хэрэглэгчийн овог оруулна уу!' }]}>
                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} />
                    </Form.Item>
                    <Form.Item name="first_name" label="Нэр:" rules={[{ required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' }]}>
                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} />
                    </Form.Item>
                    <Form.Item name="mobile" label="Утасны дугаар:" rules={[{ required: true, message: 'Та утасны дугаарыг заавал оруулна уу!' }]}>
                        <Input prefix={<MobileOutlined style={{ color: '#a1a1a1' }} />} />
                    </Form.Item>
                    {/* <Form.Item name="birthday" label="Төрсөн өдөр:">
                        <DatePicker />
                    </Form.Item> */}
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус хэрэглэгчийн мэдээллийг засварлах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                    Засварлах
                                </Button>
                            </Popconfirm>                                                                                 
                        </div>                                        
                    </Form.Item>         
                </Form>
            ) : (
                <>
                </>
            )}              
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(CustomerUpdate);