import React, { useState } from 'react';
import { Typography, Form, Row, Col, Spin, Input, Button, Select, message, Popconfirm, DatePicker, InputNumber } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";
import moment from 'moment';

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function OrderFinish (props) {

    const [form] = Form.useForm();        
    const [customerLoading, setCustomerLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [customers, setCustomers] = useState();
    const [orders, setOrders] = useState();              
    const [targetCustomer, setTargetCustomer] = useState();         
    const [targetOrder, setTargetOrder] = useState();   

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
        setOrderLoading(true)    
        const target = customers.find(x => x.id === parseInt(value))
        setTargetCustomer(target)
        axios({
            method: 'GET',
            url: api.orders + "?search=" + target.code
        })
        .then(res => {                                    
            setOrders(res.data.results.filter(o => o.returned === false));       
            setOrderLoading(false)     
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }

    function selectOrder (value) {                        
        const target = orders.find(x => x.id === parseInt(value))       
        form.setFieldsValue({
            description: target.description,
            count: target.count,
            created_at: moment(target.created_at, "YYYY-MM-DD")            
        })     
        setTargetOrder(target)        
    }

    function onFinish (values) {        
        if (targetOrder) {
            const data = {
                "description": values.description ? values.description : targetOrder.description,
                "returned": "True",                
                "token": props.token
            }            
            axios({
                method: 'PATCH',
                url: `${api.orders}/${targetOrder.id}/`,
                data: data,
                headers: {'Content-Type': 'application/json'}        
            })            
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    message.info("Захиалга хаагдлаа.")   
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                message.error("Амжилтгүй боллоо. Та дахин оролдоно уу.")
            })             
        } else {
            message.warning("Та эхлээд хаах захиалгаа сонгоно уу!")
        }               
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Захиалга хаах</Title> 
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
            <p style={{ marginBottom: '8px' }}>Захиалсан номнууд:</p>  
            { orderLoading ? (
                <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin />
                </div>
            ) : (
                <Select
                    showSearch                        
                    style={{ width: '100%', marginBottom: '24px' }}
                    placeholder="Ном сонгоно уу"                
                    onSelect={selectOrder}
                    optionFilterProp="children"
                >
                    { orders ? (
                        <>
                            {orders.map(item => {
                                return (
                                    <Option key={item.id}>{item.book.name}</Option>
                                )
                            })}
                        </>
                    ) : (
                        <></>
                    )}
                </Select>
            )}                         
            { targetCustomer && targetOrder ? (
                <Form 
                    layout="vertical" 
                    form={form}                 
                    onFinish={onFinish}
                >                                                   
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} />
                    </Form.Item>
                    <Form.Item name="count" label="Тоо ширхэг:">
                        <InputNumber defaultValue={1} />
                    </Form.Item>
                    <Form.Item name="created_at" label="Захиалсан өдөр:">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>                        
                            <Popconfirm title="Захиалгыг хаах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<CheckCircleOutlined />} style={{ marginRight: '8px' }}>
                                    Захиалга хаах
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

export default connect(mapStateToProps)(OrderFinish);