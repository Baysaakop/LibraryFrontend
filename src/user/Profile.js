import { Breadcrumb, Tabs, Form, Input, Popconfirm, Button, Result, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import api from '../api';
import { FieldNumberOutlined, UserOutlined, EditOutlined, MobileOutlined, LockOutlined, FileDoneOutlined } from '@ant-design/icons';
import OrderHistory from '../order/OrderHistory';
import PasswordChange from './PasswordChange';

const { TabPane } = Tabs;
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
                            <TabPane key={1} tab={<span><UserOutlined style={{ fontSize: '18px' }} />Хувийн мэдээлэл</span>}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ background: '#fff', border: '1px solid #d1d1d1', padding: '16px', width: '500px' }}>                                          
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
                                                <Popconfirm title="Хувийн мэдээллээ шинэчлэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                                    <Button type="primary" icon={<EditOutlined />} style={{ width: '100%' }}>
                                                        Хадгалах
                                                    </Button>
                                                </Popconfirm>                                                                                                            
                                            </Form.Item>         
                                        </Form>
                                    </div>
                                </div>
                            </TabPane> 
                            <TabPane key={2} tab={<span><LockOutlined style={{ fontSize: '18px' }} />Нууц үг солих</span>}>
                                <PasswordChange />
                            </TabPane>
                            <TabPane key={3} tab={<span><FileDoneOutlined style={{ fontSize: '18px' }} />Захиалгын түүх</span>}>
                                <OrderHistory code={user.profile.code} />
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