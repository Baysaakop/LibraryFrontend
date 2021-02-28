import React from 'react';
import { Form, Input, Button, Typography, Result, message } from 'antd';
import { LockOutlined, FieldNumberOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

function PasswordReset (props) {
    const [form] = Form.useForm();        
    
    const onFinish = (values) => {                
        if (isNaN(values.username)) {
            message.warning("SAP код нь зөвхөн цифрээс бүрдэхийг анхаарна уу.")
        } else {
            props.onReset(values.username, values.password);       
        }           
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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: '#fff', border: '1px solid #d1d1d1', padding: '16px', width: '400px' }}>
                        <Typography.Title level={3} style={{ textAlign: 'center' }}>
                            Нууц үг сэргээх                    
                        </Typography.Title>    
                        <Typography.Text type="warning">
                            ! Та нууц үгээ мартсан тохиолдолд номын санч дээр биечлэн очоод доорх талбаруудыг бөглөн нууц үгээ шинэчлэх боломжтой.
                            <br />
                            ! Зөвхөн номын санчид хандан нууц үгээ солиулах боломжтойг анхаарна уу.
                        </Typography.Text>                    
                        <Form                 
                            layout="vertical"           
                            form={form}                            
                            name="resetform"
                            className="resetform"      
                            style={{ marginTop: '16px' }}                      
                            onFinish={onFinish}                            
                        >
                            <Form.Item                                
                                name="username"
                                label="SAP код:"
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
                                    Шинэчлэх
                                </Button>
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
        onReset: (code, password) => dispatch(actions.passwordReset(code, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);