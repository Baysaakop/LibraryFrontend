import React, { useState } from 'react';
import { Typography, Form, Input, Button, Select, message, Popconfirm, Row, Col, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select

function OrderAdd(props) {

    const [form] = Form.useForm();         
    const [bookLoading, setBookLoading] = useState(false)
    const [customerLoading, setCustomerLoading] = useState(false)       
    const [books, setBooks] = useState();      
    const [customers, setCustomers] = useState(); 
    const [targetBook, setTargetBook] = useState();      
    const [targetCustomer, setTargetCustomer] = useState();         

    function onBookSearch(value) {                
        setBookLoading(true)
        axios({
            method: 'GET',
            url: api.books + "?search=" + value
        })
        .then(res => {                        
            setBooks(res.data.results);       
            setBookLoading(false)     
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectBook (value) {                        
        const target = books.find(x => x.id === parseInt(value))                
        setTargetBook(target)
    }

    function onCustomerSearch(value) {             
        setCustomerLoading(true)   
        axios({
            method: 'GET',
            url: api.customers + "?search=" + value
        })
        .then(res => {                        
            setCustomers(res.data.results);            
            setCustomerLoading(false)
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    function selectCustomer (value) {                        
        const target = customers.find(x => x.id === parseInt(value))
        setTargetCustomer(target)
    }

    function onFinish (values) {          
        if (targetBook && targetCustomer) {
            const data = {
                "book": targetBook.id,
                "customer": targetCustomer.id,
                "description": values.description ? values.description : "",
                // "count": values.count ? values.count : 1, 
                // "day": values.day ? values.day : 7,            
                "token": props.token
            }
            console.log(data)
            axios({
                method: 'POST',
                url: `${api.orders}/`,
                data: data
            })            
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    message.info("Захиалга амжилттай бүртгэгдлээ.")   
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                if (err.status === 406) {
                    message.error("Захиалсан ном дууссан байна.")
                }
                else {
                    message.error("Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.")
                }
            }) 
        } else {
            message.error("Та хэрэглэгч болон захиалах номыг сонгоно уу")
        }
    }        

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Шинээр захиалга бүртгэх</Title>
            <Row gutter={16}>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Ном хайх:</p>   
                    <Search placeholder="Номын нэрийг бичиж хайна уу" onSearch={onBookSearch} enterButton />
                </Col>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Ном сонгох:</p>   
                    { bookLoading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (
                        <Select
                            showSearch                
                            style={{ width: '100%', marginBottom: '24px' }}
                            placeholder="Номоо сонгоно уу"                
                            onSelect={selectBook}
                            optionFilterProp="children"
                        >
                            { books ? (
                                <>
                                    {books.map(item => {
                                        return (
                                            <Option key={item.id} disabled={item.available === 0}>{item.name} /{item.available === 0 ? 'Дууссан' : `${item.available} ширхэг`}/</Option>
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
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Хэрэглэгч хайх:</p>   
                    <Search placeholder="Хэрэглэгчийн SAP кодыг бичиж хайна уу" onSearch={onCustomerSearch} enterButton />
                </Col>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Хэрэглэгч сонох:</p>   
                    { customerLoading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (  
                        <Select
                            showSearch                        
                            style={{ width: '100%' }}
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
            { targetBook && targetCustomer ? (
                <Form layout="vertical" form={form} onFinish={onFinish}>     
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} />
                    </Form.Item>
                    <Popconfirm title="Тус захиалгыг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                        <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                            Бүртгэх
                        </Button>
                    </Popconfirm>                                              
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

export default connect(mapStateToProps)(OrderAdd);