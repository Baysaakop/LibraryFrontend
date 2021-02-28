import React from 'react';
import { Form, Input, Button, Typography, Result, Spin, InputNumber, message } from 'antd';
import { FieldNumberOutlined, LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Signup = (props) => {
    const [form] = Form.useForm();    
    
    const onFinish = (values) => {       
        if (isNaN(values.username)) {
            message.warning("SAP код нь зөвхөн цифрээс бүрдэхийг анхаарна уу.")
        } else {
            props.onAuth(values.username, values.firstname, values.lastname, values.password, values.confirm);      
            props.history.push('/'); 
        }         
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>            
            { props.token ? (
                <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Result                    
                        title="Та аль хэдийн нэвтэрсэн байна."                    
                        extra={<Button type="primary" href="/">Нүүр хуудас руу очих</Button>}
                    />            
                </div>               
            ) : (
                <>
                    {props.loading ? (
                        <Spin indicator={loadingIcon} />
                    ) : (
                        <div style={{ Swidth: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ background: '#fff', border: '1px solid #d1d1d1', padding: '16px', width: '400px' }}>
                                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                                    Бүртгүүлэх                  
                                </Typography.Title>                        
                                <Form                            
                                    form={form}
                                    layout="vertical"
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <Form.Item
                                        name="username"                                                          
                                        label="SAP #"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'SAP кодоо оруулна уу',   
                                            }
                                        ]}
                                    >
                                        <Input prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} placeholder="SAP #" />
                                    </Form.Item> 
                                    <Form.Item
                                        name="lastname"                                                          
                                        label="Овог"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Овог оруулна уу',   
                                            }
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} placeholder="Овог" />
                                    </Form.Item>
                                    <Form.Item
                                        name="firstname"                                                          
                                        label="Нэр"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Нэр оруулна уу',   
                                            }
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} placeholder="Нэр" />
                                    </Form.Item>                                    
                                    <Form.Item
                                        name="password"   
                                        label="Нууц үг"                                         
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Нууц үгээ оруулна уу',
                                        },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Нууц үг" />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirm"         
                                        label="Нууц үг давтах"                       
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Нууц үгээ давтан оруулна уу',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('2 нууц үг хоорондоо таарахгүй байна!');
                                            },
                                        }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Нууц үг давтах" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '8px' }}>
                                            Бүртгүүлэх
                                        </Button>
                                        <p> эсвэл 
                                            <NavLink to="/login/"> энд дарж нэвтрэнэ үү!</NavLink>
                                        </p>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    )}  
                </>
            )}
        </div>      
    );
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,        
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, firstname, lastname, password1, password2) => dispatch(actions.authSignup(username, firstname, lastname, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);