import React, { useState } from 'react';
import { Typography, Form, Input, Select, InputNumber, Row, Col, Button, Popconfirm, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function BookAdd (props) {    
    const [form] = Form.useForm();    
    const [image, setImage] = useState();
    const [categories, setCategories] = useState(); 
    const [authors, setAuthors] = useState();           
    
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

    function onFinish (values) {   
        var formData = new FormData();      
        formData.append('name', values.name);      
        if (values.code && values.code !== null) {
            formData.append('code', values.code);
        }
        if (values.description && values.description !== null) {
            formData.append('description', values.description);
        }
        if (values.category && values.category !== null) {
            formData.append('category', values.category);
        }
        if (values.author && values.author !== null) {
            formData.append('author', values.author);
        }
        if (values.published_at && values.published_at !== null) {
            formData.append('published_at', values.published_at);
        } 
        if (values.pages && values.pages !== null) {
            formData.append('pages', values.pages);
        }        
        if (values.count && values.count !== null) {
            formData.append('count', values.count);            
        }
        if (values.available && values.available !== null) {            
            formData.append('available', values.available);
        }
        if (image && image !== null) {
            formData.append('image', image);
        }            
        formData.append('token', props.token);                              
        axios({
            method: 'POST',
            url: `${api.books}/`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}            
        })                   
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                message.info("Амжилттай бүртгэгдлээ.")   
            }                        
            form.resetFields()             
        })
        .catch(err => {                            
            message.error("Бүртгэл амжилтгүй боллоо. Та дахин оролдоно уу.")
        })         
    }

    function onImageSelected (path) {        
        setImage(path);
    }
     
    function onReset () {
        form.resetFields();
    }

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Шинээр ном бүртгэх</Title>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={16}>       
                    <Col sm={24} md={5}>                        
                        <Form.Item
                            name="image"
                            label="Зураг:"
                        >                               
                            <ImageUpload onImageSelected={onImageSelected} />                        
                        </Form.Item>
                    </Col>             
                    <Col sm={24} md={8}>
                        <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та номын нэрийг оруулна уу!' }]}>
                            <Input placeholder="Харри Поттер..." />
                        </Form.Item>
                        <Form.Item name="code" label="ISBN Код:">
                            <Input placeholder="978-99973-1-457-4" />
                        </Form.Item>
                        <Form.Item name="category" label="Ангилал:">
                            <Select
                                showSearch
                                onSearch={onCategorySearch}
                                mode="multiple"
                                placeholder="Ангилал сонгоно уу"                                                
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
                        </Form.Item>
                        <Form.Item name="author" label="Зохиолч:">
                            <Select
                                showSearch
                                onSearch={onAuthorSearch}
                                mode="multiple"
                                placeholder="Зохиолч сонгоно уу"                                                
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
                        </Form.Item>                                                                       
                    </Col>                                        
                    <Col sm={24} md={3}>
                        <Form.Item name="published_at" label="Хэвлэгдсэн он:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="pages" label="Хуудасны тоо:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        {/* <Form.Item name="height" label="Урт:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="width" label="Өргөн:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="depth" label="Өндөр:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="weight" label="Жин:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="price" label="Үнэ:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item> */}
                        <Form.Item name="count" label="Тоо ширхэг:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item>
                        <Form.Item name="available" label="Бэлэн байгаа:">
                            <InputNumber defaultValue={0} min={0} />
                        </Form.Item> 
                    </Col>    
                    <Col sm={24} md={8}>
                        <Form.Item name="description" label="Тэмдэглэл:">
                            <TextArea rows={13} />
                        </Form.Item>                       
                    </Col>                                    
                </Row>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Popconfirm title="Тус номыг бүртгэх үү？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                            <Button type="primary" icon={<EditOutlined />} style={{ marginRight: '8px' }}>
                                Бүртгэх
                            </Button>
                        </Popconfirm>
                        <Button type="ghost" icon={<ReloadOutlined />} onClick={onReset} style={{ marginRight: '8px' }}>
                            Хоослох
                        </Button>                                
                    </div>                                        
                </Form.Item>                                
            </Form>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(BookAdd);