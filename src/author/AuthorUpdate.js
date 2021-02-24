import React, { useState } from 'react';
import { Typography, Form, Input, Button, Select, message, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function AuthorUpdate (props) {

    const [form] = Form.useForm();    
    const [authors, setAuthors] = useState();    
    const [selection, setSelection] = useState(); 

    function selectAuthor (value) {                        
        const target = authors.find(x => x.id === parseInt(value))
        form.setFieldsValue({
            name: target.name,
            description: target.description
        })        
        setSelection(target)
    }

    function onFinish (values) {        
        if (selection) {
            const data = {
                "name": values.name ? values.name : selection.name,
                "description": values.description ? values.description : selection.description,            
                "token": props.token
            }
            axios({
                method: 'PUT',
                url: `${api.authors}/${selection.id}/`,
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
            message.warning("Та эхлээд засварлах ангилалаа сонгоно уу!")
        }               
    }

    function onAuthorSearch(value) {                
        axios({
            method: 'GET',
            url: api.authors + "?search=" + value
        })
        .then(res => {                        
            setAuthors(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Зохиолч засварлах</Title>     
            <p style={{ marginBottom: '8px' }}>Зохиолч хайх:</p>   
            <Select
                showSearch
                onSearch={onAuthorSearch}
                style={{ width: '100%', marginBottom: '24px' }}
                placeholder="Зохиолчийн нэрийг бичнэ үү"                            
                onSelect={selectAuthor}
                optionFilterProp="children"                
            >
                { authors ? (
                    <>
                        {authors.map(item => {
                            return (
                                <Option key={item.id}>{item.name}</Option>
                            )
                        })}
                    </>
                ) : (
                    <></>
                )}
            </Select>         
            { selection ? (
                <Form 
                    layout="vertical" 
                    form={form}                 
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та зохиолчийн нэрийг оруулна уу!' }]}>
                        <Input prefix={<UserOutlined style={{ color: '#a1a1a1' }} />} />
                    </Form.Item>
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус зохиолчийн мэдээллийг засварлах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                    Засварлах
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

export default connect(mapStateToProps)(AuthorUpdate);