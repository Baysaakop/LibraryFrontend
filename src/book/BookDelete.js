import React, { useState } from 'react';
import { Typography, Spin, Form, Input, Select, InputNumber, Row, Col, Button, Popconfirm, message } from 'antd';
import ImageUpload from '../components/ImageUpload';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { connect } from "react-redux";

const { Title } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

function BookDelete (props) {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); 
    const [image, setImage] = useState();
    const [books, setBooks] = useState(); 
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

    function onFinish (values) {                          
        if (selection) {
            axios({
                method: 'DELETE',
                url: `${api.books}/${selection.id}/`                
            })            
            .then(res => {                
                if (res.status === 200 || res.status === 204) {
                    message.info("Сонгосон номыг устгалаа.")   
                }                        
                form.resetFields()             
            })
            .catch(err => {                            
                message.error("Устгаж чадсангүй. Та дахин оролдоно уу.")
            }) 
        } else {
            message.warning("Та эхлээд устгах номоо сонгоно уу!")
        }   
    }

    function onImageSelected (path) {        
        setImage(path);
    } 

    return (
        <div style={{ padding: '8px' }}>
            <Title level={4}>Ном устгах</Title>
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
                                <Input placeholder="Харри Поттер..." disabled />
                            </Form.Item>
                            <Form.Item name="code" label="Код:">
                                <Input placeholder="978-99973-1-457-4" disabled />
                            </Form.Item>
                            <Form.Item name="category" label="Ангилал:">
                                <Select
                                    disabled
                                    showSearch                                    
                                    mode="multiple"
                                    placeholder="Ангилал сонгоно уу"                                                
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >                                    
                                </Select>
                            </Form.Item>   
                            <Form.Item name="author" label="Зохиолч:">
                                <Select
                                    disabled
                                    showSearch                                    
                                    mode="multiple"
                                    placeholder="Зохиолч сонгоно уу"                                                
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >                                    
                                </Select>
                            </Form.Item>                                                                                                          
                        </Col>                                           
                        <Col sm={24} md={3}>
                            <Form.Item name="published_at" label="Хэвлэгдсэн он:">
                                <InputNumber defaultValue={0} min={0} disabled />
                            </Form.Item>
                            <Form.Item name="pages" label="Хуудасны тоо:">
                                <InputNumber defaultValue={0} min={0} disabled />
                            </Form.Item>
                            <Form.Item name="count" label="Тоо ширхэг:">
                                <InputNumber defaultValue={0} min={0} disabled />
                            </Form.Item> 
                            <Form.Item name="available" label="Бэлэн байгаа:">
                                <InputNumber defaultValue={0} min={0} disabled />
                            </Form.Item>                        
                        </Col>     
                        <Col sm={24} md={8}>
                            <Form.Item name="description" label="Тэмдэглэл:">
                                <TextArea rows={5} disabled />
                            </Form.Item>                      
                        </Col>                                        
                    </Row>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Popconfirm title="Тус номыг устгах уу？" okText="Тийм" cancelText="Үгүй" onConfirm={form.submit}>
                                <Button danger type="primary" icon={<DeleteOutlined />} style={{ marginRight: '8px' }}>
                                    Устгах
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

export default connect(mapStateToProps)(BookDelete);