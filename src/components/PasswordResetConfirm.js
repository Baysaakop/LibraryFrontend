import React, { useState, useEffect } from 'react';
import { Button, message, Popconfirm, Spin, Table, Typography } from 'antd';
import axios from 'axios';
import api from '../api';
import moment from 'moment';

const { Title } = Typography;

function PasswordResetConfirm (props) {

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState();    

    useEffect(() => {        
        getRequests();
    }, [])

    function getRequests() {
        setLoading(true);
        axios({
            method: 'GET',
            url: api.resetrequests + "/"
        })
        .then(res => {                                                     
            setRequests(res.data.results);        
            setLoading(false);                
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }

    function approve(item) {        
        let request = requests.find(x => x.id === item);
        if (request) {
            const data = {
                "approved": "True"                
            }
            axios({
                method: 'PUT',
                url: `${api.resetrequests}/${request.id}/`,
                data: data
            })            
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    message.info("Хэрэглэгчийн хүсэлтийг зөвшөөрлөө.")   
                }                        
                getRequests();
            })
            .catch(err => {                            
                message.error("Засвар амжилтгүй боллоо. Та дахин оролдоно уу.")
            })
        } 
    }

    function remove(id) {        
        axios({
            method: 'DELETE',
            url: `${api.resetrequests}/${id}/`                
        })            
        .then(res => {
            if (res.status === 200 || res.status === 204) {
                message.info("Хэрэглэгчийн хүсэлтийг устгалаа.")   
            }                        
            getRequests();
        })
        .catch(err => {                            
            message.error("Засвар амжилтгүй боллоо. Та дахин оролдоно уу.")
        }) 
    }

    const columns = [
        {
            title: 'SAP Код',
            dataIndex: 'code',
            key: 'code',
        },              
        {
            title: 'Огноо',
            dataIndex: 'created_at',
            key: 'created_at',
            render: item => <span>{moment(item.toString()).format("YYYY-MM-DD HH:mm:ss").toString()}</span>
        },
        {
            title: 'Хариу',
            dataIndex: 'id',
            key: 'id',
            render: item => 
                <div>
                    <Popconfirm title="Хэрэглэгчийн хүсэлтийг зөвшөөрөх үү?" okText="Тийм" cancelText="Үгүй" onConfirm={() => approve(item)} >
                        <Button type="primary" style={{ marginRight: '8px' }}>Зөвшөөрөх</Button>
                    </Popconfirm>
                    <Popconfirm title="Хэрэглэгчийн хүсэлтийг устгах уу?" okText="Тийм" cancelText="Үгүй" onConfirm={() => remove(item)} >
                        <Button danger type="primary">Устгах</Button>
                    </Popconfirm>
                </div>            
        }        
    ];

    return (
        <div>
            <Title level={4}>Нууц үг сэргээх хүсэлтүүд</Title>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px' }}>
                    <Spin />
                </div>
            ) : (
                <Table columns={columns} dataSource={requests ? requests : undefined} pagination={{ pageSize: 20 }} />
            )}          
        </div>
    )
}

export default PasswordResetConfirm;