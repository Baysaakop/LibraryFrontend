import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { Breadcrumb, Form, Row, Col, Select, List, Spin, Input, Pagination } from 'antd';
import BookCard from './BookCard';

const { Option } = Select;
const { Search } = Input;

function BookList (props) {
    const [form] = Form.useForm();
    const [books, setBooks] = useState();
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState();    
    const [category, setCategory] = useState();   

    useEffect(() => {                        
        if (!categories) {
            axios({
                method: 'GET',
                url: api.categories
            })
            .then(res => {                        
                setCategories(res.data.results);            
            })        
            .catch(err => {
                console.log(err.message);
            }) 
        };   
        let name = getLocationSearch(props.location.search);
        setSearch(name)
        form.setFieldsValue({            
            name: name           
        }) 
        getBooks(name, category, page);
    }, [props.location.search]);     
    
    function getLocationSearch(value) {    
        if (value && value !== null && value.length > 0 && value.includes("=")) {
            let res = value.split("=");            
            return res[1];
        } else {
            return "";
        }    
    }

    function onNameSearch(value) {        
        setSearch(value);
        setPage(1);
        setCategory(undefined)
        form.setFieldsValue({            
            category: undefined           
        })     
        getBooks(value, undefined, 1);
    }

    function selectCategory (value) {
        const target = categories.find(x => x.id === parseInt(value))          
        setCategory(target);
        setPage(1);
        setSearch("");
        form.setFieldsValue({            
            name: undefined           
        }) 
        getBooks("", target, 1)
    }    

    function getBooks (name, type, page) {
        setLoading(true);
        var url = api.books;
        var params = "";
        if (name && name.length > 0) {
            params = "search=" + name;
        }
        else if (type) {
            params = "search=" + type.id;
        }
        params = "?" + params + "&ordering=-created_at&page=" + page;     
        console.log(url + params)
        axios({
            method: 'GET',
            url: url + params
        })
        .then(res => {                 
            // console.log(res.data);                                  
            setBooks(res.data.results);
            setTotal(res.data.count);
            setLoading(false);
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function onPageChange (pageNum, pageSize) {
        setPage(pageNum)
        getBooks(search, category, pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} ном:`;
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Нүүр</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Номын жагсаалт
                </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ margin: '16px 0', padding: '16px', background: '#fff' }}>
                <Form form={form} layout="vertical">
                    <Row gutter={16} style={{ margin: '8px 0' }}>
                        <Col sm={24} md={8}>
                            <Form.Item name="name" label="Ном хайх:">
                            {/* <p style={{ marginBottom: '8px' }}>Ном хайх:</p>  */}
                                <Search placeholder="Номны нэрийг бичиж хайх" onSearch={onNameSearch} enterButton />
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={8}>
                            <Form.Item name="category" label="Ангиллаар шүүх:">
                                {/* <p style={{ marginBottom: '8px' }}>Ангилал сонгох:</p>  */}
                                <Select
                                    defaultValue={category}
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Ангилал сонгох"                
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
                            </Form.Item>                                                    
                        </Col>                                                           
                        <Col sm={24} md={8}>
                            <Form.Item name="sort" label="Эрэмбэлэх:">                                
                                <Select                                
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Эрэмбэ сонгох"                
                                    onChange={selectCategory}
                                    optionFilterProp="children"                
                                >
                                    <Option key="new">Шинээр нэмэгдсэн</Option>
                                    <Option key="trend">Их хандалттай</Option>
                                    <Option key="count">Нийт тоо</Option>
                                    <Option key="available">Бэлэн байгаа</Option>
                                </Select>
                            </Form.Item>  
                        </Col>
                    </Row>
                </Form>                
                { !loading ? (
                    <>
                        <List
                            style={{ margin: '16px 8px' }}
                            grid={{
                                gutter: 16,
                                xs: 2,
                                sm: 3,
                                md: 4,
                                lg: 6,
                                xl: 8,
                                xxl: 10,
                            }}
                            dataSource={books}
                            renderItem={item => (
                                <List.Item>
                                    <BookCard item={item} />                                    
                                </List.Item>
                            )}
                        />
                        <Pagination 
                            style={{ margin: '0 8px' }}
                            current={page} 
                            total={total}                                                         
                            pageSize={24}
                            hideOnSinglePage={true} 
                            showSizeChanger={false}
                            showTotal={showTotal}
                            onChange={onPageChange} 
                        />
                    </>
                ) : (
                    <div style={{ width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Spin />
                    </div>
                )}
            </div>            
        </div>
    )
}

export default BookList;