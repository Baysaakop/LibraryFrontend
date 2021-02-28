import { Grid, Card, List, Typography, Row, Col, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import BookCard from '../book/BookCard';
import Vote from '../components/Vote';
import { ArrowUpOutlined } from '@ant-design/icons';

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
            return 7;
        } else if (screens.xl) {
            return 6;
        } else if (screens.lg) {
            return 5;
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
                    <Col xs={24} sm={24} md={24} lg={18}>
                        <Card title="Шинээр нэмэгдсэн" extra={<a href="/books">Бүгд</a>} bordered={false} style={{ width: '100%', marginBottom: '16px' }}>
                            <List                        
                                grid={{
                                    gutter: 16,
                                    xs: 2,
                                    sm: 3,
                                    md: 4,
                                    lg: 5,
                                    xl: 6,
                                    xxl: 7,
                                }}                                
                                style={{ padding: '16px 16px 0 16px' }}
                                dataSource={latestBooks ? latestBooks.slice(0, getNumber()) : undefined}
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
                                    lg: 5,
                                    xl: 6,
                                    xxl: 7,
                                }}                                
                                style={{ padding: '16px 16px 0 16px' }}
                                dataSource={trendBooks ? trendBooks.slice(0, getNumber()) : undefined}
                                renderItem={item => (
                                    <List.Item>
                                        <BookCard item={item} />                                    
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6}>
                        <Vote />
                    </Col>
                </Row>                    
                {/* <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={8}>
                        <Card title="Захиалга /2 дугаар сард/" extra={<Statistic value={8.5} precision={1} valueStyle={{ color: 'green', fontSize: '18px' }} prefix={<ArrowUpOutlined />} suffix="%" />}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                <Statistic value={1014} valueStyle={{ fontSize: '32px' }} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Card title="Ном" extra={<Statistic value={3.1} precision={1} valueStyle={{ color: 'green', fontSize: '18px' }} prefix={<ArrowUpOutlined />} suffix="%" />}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                <Statistic value={326} valueStyle={{ fontSize: '32px' }} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Card title="Хэрэглэгч" extra={<Statistic value={2.5} precision={1} valueStyle={{ color: 'green', fontSize: '18px' }} prefix={<ArrowUpOutlined />} suffix="%" />}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                <Statistic value={419} valueStyle={{ fontSize: '32px' }} />
                            </div>
                        </Card>
                    </Col>
                </Row> */}
            </div>
        </div>
    )
}

export default Home;