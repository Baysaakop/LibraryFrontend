import React, { useState } from 'react';
import { Typography, Row, Col, Spin, Form, Input, Select, InputNumber, Button, Popconfirm, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function BookUpdate (props) {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); 
    const [image, setImage] = useState();
    const [books, setBooks] = useState(); 
    const [categories, setCategories] = useState(); 
    const [authors, setAuthors] = useState();       
    const [selection, setSelection] = useState();           
    
    function onBookSearch(value) {                
        setLoading(true)
        axios({
            method: 'GET',
            url: api.books + "?search=" + value
        })
        .then(res => {                        
            setBooks(res.data.results);        
            setLoading(false)    
        })        
        .catch(err => {
            console.log(err.message);
        })      
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

    function selectBook (value) {                        
        const target = books.find(x => x.id === parseInt(value))                
        form.setFieldsValue({
            name: target.name,
            code: target.code,
            description: target.description,
            category: getNamesFromArray(target.category),         
            author: getNamesFromArray(target.author),                      
            published_at: target.published_at,
            pages: target.pages,                              
            count: target.count, 
            available: target.available               
        })     
        setImage(target.image)        
        setSelection(target)
    }

    function getNamesFromArray (array) {
        let result = []
        array.forEach(item => {
            result.push(item.name.toString())
        });        
        return result
    }

    function compareM2M (ids, objects) {
        if (ids.length !== objects.length) {
            return false;
        }
        let i;
        for (i = 0; i < ids.length; i++) {
            if (parseInt(ids[i]) !== parseInt(objects[i].id)) {
                return false;
            }
        }
        return true;
    }

    function onFinish (values) {       
        if (selection) {                                     
            var formData = new FormData();            
            if (values.name !== selection.name) {                
                formData.append('name', values.name);
            }
            if (values.code !== selection.code) {                
                formData.append('code', values.code);
            }
            if (values.description !== selection.description) {                
                formData.append('description', values.description);
            }
            if (!compareM2M(values.category, selection.category)) {                
                formData.append('category', values.category);
            }
            if (!compareM2M(values.author, selection.author)) {                
                formData.append('author', values.author);
            }
            if (values.published_at !== selection.published_at) {
                formData.append('published_at', values.published_at);
            }
            if (values.pages !== selection.pages) {
                formData.append('pages', values.pages);
            }            
            if (values.count !== selection.count) {
                formData.append('count', values.count);                
            }             
            if (values.available !== selection.available) {
                formData.append('available', values.available);                
            }  
            if (image !== selection.image) {                
                formData.append('image', image);
            }            
            formData.append('token', props.token);              
            axios({
                method: 'PUT',
                url: `${api.books}/${selection.id}/`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}            
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
            message.warning("Та эхлээд засварлах номоо сонгоно уу!")
        }             
    }   

    function onImageSelected (path) {        
        setImage(path);
    } 

    return (
        <div style={{ padding: '8px' }}>                            
            <Title level={4}>Ном засварлах</Title>
            <Row gutter={16}>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Ном хайх:</p>   
                    <Search placeholder="Номын нэрийг бичиж хайна уу" onSearch={onBookSearch} enterButton />
                </Col>
                <Col sm={24} md={12}>
                    <p style={{ marginBottom: '8px' }}>Ном сонгох:</p>   
                    { loading ? (
                        <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    ) : (
                        <Select
                            showSearch                
                            style={{ width: '100%', marginBottom: '24px' }}
                            placeholder="Номоо сонгоно уу"                
                            onSelect={selectBook}
                            optionFilterProp="children"
                        >
                            { books ? (
                                <>
                                    {books.map(item => {
                                        return (
                                            <Option key={item.id}>{item.name}</Option>
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
            { selection ? (
                <Form layout="vertical" form={form} onFinish={onFinish}>                        
                    <Row gutter={16}>              
                        <Col sm={24} md={5}>                        
                            <Form.Item
                                name="image"
                                label="Зураг:"
                            >                               
                                <ImageUpload onImageSelected={onImageSelected} image={image ? image : undefined} />                        
                            </Form.Item>
                        </Col>           
                        <Col sm={24} md={8}>
                            <Form.Item name="name" label="Нэр:" rules={[{ required: true, message: 'Та номын нэрийг оруулна уу!' }]}>
                                <Input placeholder="Харри Поттер..." />
                            </Form.Item>
                            <Form.Item name="code" label="Код:">
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
                            <Form.Item name="count" label="Тоо ширхэг:">
                                <InputNumber defaultValue={0} min={0} />
                            </Form.Item> 
                            <Form.Item name="available" label="Бэлэн байгаа:">
                                <InputNumber defaultValue={0} min={0} />
                            </Form.Item>                        
                        </Col>  
                        <Col sm={24} md={8}>
                            <Form.Item name="description" label="Танилцуулга:">
                                <TextArea rows={13} />
                            </Form.Item>                    
                        </Col>                                          
                    </Row>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус номыг засварлах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
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

export default connect(mapStateToProps)(BookUpdate);