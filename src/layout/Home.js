import { Grid, Card, List, Typography, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import BookCard from '../book/BookCard';
import Vote from '../components/Vote';

const { useBreakpoint } = Grid;
const { Title } = Typography;

function Home (props) {     
    const screens = useBreakpoint();
    const [latestBooks, setLatestBooks] = useState();    
    const [trendBooks, setTrendBooks] = useState();    

    useEffect(() => {
        getLatest();
        getTrends();
    }, []);

    function getLatest() {
        axios({
            method: 'GET',
            url: api.books + "?ordering=-created_at"
        })
        .then(res => {                                                       
            setLatestBooks(res.data.results);
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    function getTrends() {
        axios({
            method: 'GET',
            url: api.books + "?ordering=-orders"
        })
        .then(res => {                                                       
            setTrendBooks(res.data.results);
        })
        .catch(err => {
            console.log(err.message);
        })
    }
    
    function getNumber() {
        if (screens.xxl) {
            return 8;
        } else if (screens.xl) {
            return 6;
        } else if (screens.lg) {
            return 4;
        } else if (screens.md) {
            return 4;
        } else if (screens.sm) {
            return 3;
        } else {
            return 2;
        }
    }

    return (
        <div>
            <div style={{ margin: '16px 0' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={18} style={{ display: 'block' }}>
                        <Card title="Шинээр нэмэгдсэн" extra={<a href="/books">Бүгд</a>} bordered={false} style={{ width: '100%', marginBottom: '16px' }}>
                            <List                        
                                grid={{
                                    gutter: 16,
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                    xxl: 8,
                                }}
                                dataSource={latestBooks ? latestBooks.slice(0, 8) : undefined}
                                renderItem={item => (
                                    <List.Item>
                                        <BookCard item={item} />                                    
                                    </List.Item>
                                )}
                            />
                        </Card>  
                        <Card title="Тренд номнууд" extra={<a href="/books">Бүгд</a>} bordered={false} style={{ width: '100%', marginBottom: '16px' }}>
                            <List                        
                                grid={{
                                    gutter: 16,
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                    xxl: 8,
                                }}
                                dataSource={trendBooks ? trendBooks.slice(0, 8) : undefined}
                                renderItem={item => (
                                    <List.Item>
                                        <BookCard item={item} />                                    
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} style={{ display: 'block' }}>
                        <Vote />
                    </Col>
                </Row>                
            </div>
        </div>
    )
}

export default Home;