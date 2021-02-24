import React, { useState } from 'react';
import { Typography, Form, Input, Button, Select, message, Popconfirm } from 'antd';
import { TagsOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function CategoryUpdate (props) {

    const [form] = Form.useForm();        
    const [categories, setCategories] = useState();    
    const [selection, setSelection] = useState();  

    function selectCategory (value) {                        
        const target = categories.find(x => x.id === parseInt(value))
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
                url: `${api.categories}/${selection.id}/`,
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

    function onCategorySearch(value) {                
        axios({
            method: 'GET',
            url: api.categories + "?search=" + value
        })
        .then(res => {                        
            setCategories(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        })      
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Ангилал засварлах</Title>           
            <p style={{ marginBottom: '8px' }}>Ангилал хайх:</p> 
            <Select
                showSearch
                onSearch={onCategorySearch}
                style={{ width: '100%', marginBottom: '24px' }}
                placeholder="Ангиллын нэрийг бичнэ үү"                
                onChange={selectCategory}
                optionFilterProp="children"                
            >
                { categories ? (
                    <>
                        {categories.map(item => {
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
                    <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та ангиллын нэрийг оруулна уу!' }]}>
                        <Input prefix={<TagsOutlined style={{ color: '#a1a1a1' }} />} />
                    </Form.Item>
                    <Form.Item name="description" label="Тэмдэглэл:">
                        <TextArea rows={8} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title=" Тус ангиллын мэдээллийг засварлах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
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

export default connect(mapStateToProps)(CategoryUpdate);