import React from 'react';
import { Form, Input, Button, Typography, Result, Spin, message } from 'antd';
import { LoadingOutlined, LockOutlined, FieldNumberOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Login = (props) => {
    const [form] = Form.useForm();        
    
    const onFinish = (values) => {                
        if (isNaN(values.username)) {
            message.warning("SAP код нь зөвхөн цифрээс бүрдэхийг анхаарна уу.")
        } else {
            props.onAuth(values.username, values.password);       
        }           
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    if (props.token) {
        return <Redirect to='/' />
    }

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
                        <div style={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ background: '#fff', border: '1px solid #d1d1d1', padding: '16px', width: '400px' }}>
                                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                                    Нэвтрэх                    
                                </Typography.Title>                        
                                <Form                 
                                    layout="vertical"           
                                    form={form}                            
                                    name="normal_login"
                                    className="login-form"
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
                                            },
                                        ]}
                                    >
                                        <Input prefix={<FieldNumberOutlined style={{ color: '#a1a1a1' }} />} placeholder="SAP #" />
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
                                    >
                                        <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Нууц үг" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '8px' }}>
                                            Нэвтрэх
                                        </Button>
                                        <p> эсвэл 
                                            <NavLink to="/signup/"> энд дарж бүртгүүлнэ үү!</NavLink>
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
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);