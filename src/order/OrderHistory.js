import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { Spin, Table, Tag, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

function OrderHistory(props) {

    const [orders, setOrders] = useState();

    const columns = [
        {
            title: 'Ном',
            dataIndex: 'book',
            key: 'book',
            render: item => <span>{item.name}</span>
        },
        {
            title: 'Тоо',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Захиалсан',
            dataIndex: 'created_at',
            key: 'created_at',    
            render: item => <span>{moment(item.toString()).format("YYYY-MM-DD HH:mm:ss").toString()}</span>
        },
        {
            title: 'Буцааж өгсөн',
            dataIndex: 'returned_at',
            key: 'returned_at',    
            render: item => <span>{item ? moment(item.toString()).format("YYYY-MM-DD HH:mm:ss").toString() : '---------'}</span>
        },
        {
            title: 'Төлөв',
            dataIndex: 'returned',
            key: 'returned',            
            render: item => <Tag color={item === true ? 'green': 'red'}>{item === true ? 'ӨГСӨН': 'ӨГӨӨГҮЙ'}</Tag>
        },
    ];

    useEffect(() => {        
        axios({
            method: 'GET',
            url: api.orders + "?search=" + props.code
        })
        .then(res => {                       
            console.log(res.data.results)             
            setOrders(res.data.results);                   
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }, [props.code])

    return (
        <div>
            <Title level={4}>Захиалгын түүх</Title>
            { orders ? (
                <div>
                    <Table columns={columns} dataSource={orders} pagination={{ pageSize: 10 }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin />
                </div>
            )}
        </div>
    )
}

export default OrderHistory;