import React, { useState, useEffect } from 'react';
import { Button, message, Popconfirm, Spin, Table, Typography } from 'antd';
import axios from 'axios';
import api from '../api';
import moment from 'moment';
import { connect } from "react-redux";

const { Title } = Typography;

function UserRequests (props) {
    
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState();    

    useEffect(() => {        
        getUsers();
    }, [])

    function getUsers() {
        setLoading(true);
        axios({
            method: 'GET',
            url: api.users + "/"
        })
        .then(res => {                                         
            console.log(res.data.results)
            setUsers(res.data.results.filter(x => x.profile.verified === false));        
            setLoading(false);                
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }

    function approve(item) {        
        let user = users.find(x => x.id === item);
        if (user) {
            const data = {
                "verified": "True",
                "token": props.token
            }
            axios({
                method: 'PUT',
                url: `${api.customers}/${user.profile.id}/`,
                data: data
            })            
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    message.info("Хэрэглэгчийн хүсэлтийг зөвшөөрлөө.")   
                }                        
                getUsers();
            })
            .catch(err => {                            
                message.error("Засвар амжилтгүй боллоо. Та дахин оролдоно уу.")
            })
        } 
    }

    function remove(id) {        
        axios({
            method: 'DELETE',
            url: `${api.users}/${id}/`                
        })            
        .then(res => {
            if (res.status === 200 || res.status === 204) {
                message.info("Хэрэглэгчийн хүсэлтийг устгалаа.")   
            }                        
            getUsers();
        })
        .catch(err => {                            
            message.error("Засвар амжилтгүй боллоо. Та дахин оролдоно уу.")
        }) 
    }

    const columns = [
        {
            title: 'SAP Код',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Овог',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Нэр',
            dataIndex: 'first_name',
            key: 'first_name',
        },        
        {
            title: 'Огноо',
            dataIndex: 'profile',
            key: 'profile',
            render: item => <span>{moment(item.created_at.toString()).format("YYYY-MM-DD HH:mm:ss").toString()}</span>
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
        <div style={{ padding: '8px' }}>
            <Title level={4}>Шинэ хэрэглэгчийн хүсэлтүүд</Title>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px' }}>
                    <Spin />
                </div>
            ) : (
                <Table columns={columns} dataSource={users ? users : undefined} pagination={{ pageSize: 20 }} />
            )}            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(UserRequests);