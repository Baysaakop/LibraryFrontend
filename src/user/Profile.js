import { Breadcrumb, Tabs, Form, Input, Popconfirm, Button, Result, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import { FieldNumberOutlined, ReadOutlined, UserOutlined, EditOutlined, MobileOutlined, LockOutlined } from '@ant-design/icons';
import ActiveOrders from '../order/ActiveOrders';

const { TabPane } = Tabs;
const { Title } = Typography;
const { TextArea } = Input;

function Profile (props) {
    const [form] = Form.useForm();
    const [user, setUser] = useState();    

    useEffect(() => {        
        axios({
            method: 'GET',
            url: api.profile,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`
            }
        }).then(response => {            
            const target = response.data            
            setUser(target)
            form.setFieldsValue({
                code: target.profile.code,                
                first_name: target.profile.first_name,
                last_name: target.profile.last_name,                           
                mobile: target.profile.mobile,      
                description: target.description,
                role: target.profile.role === "1" ? "Админ" : target.profile.role === "2" ? "Ажилтан" : "Хэрэглэгч"
            })             
        }).catch(error => {
            console.log(error)
        })
    }, [props.token])

    function onFinish (values) {                  
        const data = {                            
            "last_name": values.last_name,
            "first_name": values.first_name,
            "mobile": values.mobile,                
            "description": values.description,            
            "token": props.token
        }
        axios({
            method: 'PUT',
            url: `${api.customers}/${user.profile.id}/`,
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

    return (
        <div>
            {user ? (
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <a href="/">Нүүр</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Хэрэглэгчийн цонх
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ margin: '16px 0', background: '#fff', padding: '16px' }}>
                        <Tabs defaultActiveKey={1}>
                            <TabPane key={1} tab={<span><UserOutlined />Хувийн мэдээлэл</span>}>
                                <div style={{ padding: '8px' }}>
                                    <Title level={4}>Хувийн мэдээлэл</Title>
                                    <Form layout="vertical" form={form} onFinish={onFinish}>
                                        <Form.Item name="code" label="SAP код:">
                                            <Input disabled prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} />
                                        </Form.Item>                                        
                                        <Form.Item name="last_name" label="Овог:">
                                            <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} />
                                        </Form.Item>
                                        <Form.Item name="first_name" label="Нэр:">
                                            <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} />
                                        </Form.Item>
                                        <Form.Item name="mobile" label="Утасны дугаар:">
                                            <Input prefix={<MobileOutlined style={{ color: '#a1a1a1' }} />} />
                                        </Form.Item>                                        
                                        <Form.Item name="description" label="Тэмдэглэл:">
                                            <TextArea rows={8} />
                                        </Form.Item>
                                        <Form.Item name="role" label="Хандах эрх:">
                                            <Input prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} disabled />
                                        </Form.Item>
                                        <Form.Item>
                                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>                        
                                                <Popconfirm title="Хувийн мэдээллээ шинэчлэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                                    <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                                        Хадгалах
                                                    </Button>
                                                </Popconfirm>                              
                                            </div>                                        
                                        </Form.Item>         
                                    </Form>
                                </div>
                            </TabPane> 
                            <TabPane key={2} tab={<span><ReadOutlined />Захиалгууд</span>}>
                                <ActiveOrders code={user.profile.code} />
                            </TabPane>  
                        </Tabs>
                    </div>
                </div>
            ) : (
                <Result
                    status="403"
                    title="403"
                    subTitle="Уучлаарай, та эхлээд нэвтэрнэ үү."
                    extra={<Button type="primary" href="/login">Нэвтрэх хэсэг рүү очих</Button>}
                />
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(Profile)