import React, { useState } from 'react';
import { Typography, Form, Input, Select, Button, message, Popconfirm, Row, Col, Spin } from 'antd';
import { FieldNumberOutlined, UserOutlined, MobileOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function RoleChange (props) {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState();    
    const [selection, setSelection] = useState();     

    function onStaffSearch(value) {         
        setLoading(true)       
        axios({
            method: 'GET',
            url: api.customers + "?search=" + value
        })
        .then(res => {                                
            setUsers(res.data.results);            
            setLoading(false)
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectStaff (value) {                        
        const target = users.find(x => x.id === parseInt(value))
        form.setFieldsValue({
            code: target.code,
            mobile: target.mobile,
            last_name: target.last_name,
            first_name: target.first_name,
            role: target.role,
            description: target.description
        })        
        setSelection(target)
    }

    function onFinish (values) {                    
        if (selection && values.role) {
            if (values.role !== selection.role) {
                const data = {
                    "role": values.role,                          
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
            }
            else {
                message.warning("Та эхлээд хэрэглэгчийн хандах эрхийг солино уу!")
            }
        } else {
            message.warning("Та эхлээд хэрэглэгчээ сонгоно уу!")
        }               
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Ажилтны эрх солих</Title>
            <Row gutter={16}>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Хэрэглэгч хайх:</p>    
                    <Search placeholder="Хэрэглэгчийн SAP кодыг бичиж хайна уу" onSearch={onStaffSearch} enterButton />                     
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
                            onSelect={selectStaff}
                            optionFilterProp="children"
                        >
                            { users ? (
                                <>
                                    {users.map(item => {
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
                    <Form.Item name="code" label="SAP #:">
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
                    <Form.Item name="role" label="Хандах эрх:" rules={[{ required: true, message: 'Та хэрэглэгчийн хандар эрхийг сонгоно уу!' }]}>
                        <Select
                            showSearch                                                
                            style={{ width: '100%', marginBottom: '24px' }}
                            placeholder="Хандах эрх сонгоно уу"                                            
                            optionFilterProp="children"
                        >
                            <Option key="1">Админ</Option>
                            <Option key="2">Ажилтан</Option>                            
                            <Option key="3">Хэрэглэгч</Option>       
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус хэрэглэгчийн хандалтын эрхийг солих уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                    Хадгалах
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

export default connect(mapStateToProps)(RoleChange);