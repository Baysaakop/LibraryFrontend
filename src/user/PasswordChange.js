import React from 'react';
import { Form, Input, Button, Result, Popconfirm } from 'antd';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

function PasswordChange (props) {

    const [form] = Form.useForm();        
    
    const onFinish = (values) => {                
        props.onChangePassword(values.oldpassword, values.password, values.confirm, props.token);            
    };

    return (
        <div>
            { !props.token ? (
                <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Result              
                        status="warning"      
                        title="Та эхлээд нэвтэрч орох шаардлагатай."                    
                        extra={<Button type="primary" href="/login">Нэвтрэх хуудас руу очих</Button>}
                    />            
                </div>    
            ) : (
                <div style={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: '#fff', border: '1px solid #d1d1d1', padding: '16px', width: '400px' }}>                     
                        <Form                 
                            layout="vertical"           
                            form={form}                            
                            name="passwordchangeform"
                            className="passwordchangeform"
                            onFinish={onFinish}                            
                        >
                            <Form.Item                                
                                name="oldpassword"
                                label="Хуучин нууц үг"
                                rules={[
                                {
                                    required: true,
                                    message: 'Хуучин нууц үгээ оруулна уу',
                                },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined style={{ color: '#a1a1a1' }} />} placeholder="Хуучин нууц үг" />
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
                                <Popconfirm title="Нууц үг солих уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                    <Button type="primary" icon={<EditOutlined />} style={{ width: '100%' }}>
                                        Хадгалах
                                    </Button>
                                </Popconfirm>    
                            </Form.Item>
                        </Form>
                    </div>
                </div> 
            )} 
        </div>
    )
}

const mapStateToProps = (state) => {
    return {        
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onChangePassword: (oldpassword, password1, password2, token) => dispatch(actions.passwordChange(oldpassword, password1, password2, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange);