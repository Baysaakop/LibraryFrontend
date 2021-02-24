import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { Card, Statistic, Row, Col, Checkbox, Input, message, Table } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

const { Countdown } = Statistic;

function Vote (props) {    
    const [voteSelect, setVoteSelect] = useState();        
    const [name, setName] = useState();
    const [user, setUser] = useState();
    const [deadline, setDeadline] = useState();

    const columns = [
        {
            title: 'Checked',
            dataIndex: 'id',        
            key: 'id',
            render: id => <Checkbox checked={checkIfSelected(id)} value={id} onChange={onOptionSelect}></Checkbox>
        },
        {
            title: 'Name',
            dataIndex: 'name',        
        },
        {
            title: 'Count',
            dataIndex: 'count',
        },
    ];

    useEffect(() => {                            
        getVoteResult();
    }, []);

    function getVoteResult() {                                    
        axios({
            method: 'GET',
            url: api.vote_selects
        })
        .then(res => {    
            let target = res.data.results[0];             
            setVoteSelect(target);                   
            let created_at = moment(target.created_at.toString(), "YYYY-MM-DD HH:mm:ss");
            let date = new Date(created_at.year(), created_at.month() + 1, 1); 
            setDeadline(date)                                            
        })
        .catch(err => {
            console.log(err.message);
        })
        if (props.token && !user) {                          
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            }).then(res => {            
                setUser(res.data)                              
            }).catch(error => {
                console.log(error)
            })              
        }                
    }

    function getVoteOptions (data) {
        return data.sort((a, b) => b.count - a.count);
    }

    function checkIfSelected (id) {
        if (voteSelect && user) {
            let vote = voteSelect.votes.filter(x => x.customer === user.id)[0];
            if (vote && vote.selections.indexOf(id) > -1) {
                return true;
            }
        }
        return false;
    }
    
    function onOptionSelect (e) {
        let id = e.target.value
        let checked = e.target.checked
        if (props.token && user) {
            let votes = voteSelect.votes;
            let vote = votes.filter(x => x.customer === user.id)[0];
            if (vote) {
                const data = {        
                    "option": id,
                    "token": props.token
                }
                axios({
                    method: 'PUT',
                    url: `${api.votes}/${vote.id}/`,
                    data: data
                })            
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        message.info("Таны саналыг бүртгэж авлаа.")   
                    }                                         
                    getVoteResult();        
                })
                .catch(err => {                        
                    message.error("Амжилтгүй боллоо. Та дахин оролдоно уу.")              
                }) 
            } else {
                const data = {        
                    "option": id,
                    "token": props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.votes}/`,
                    data: data
                })            
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        message.info("Таны саналыг бүртгэж авлаа.")   
                    }                                                     
                    getVoteResult();    
                })
                .catch(err => {                        
                    message.error("Амжилтгүй боллоо. Та дахин оролдоно уу.")              
                }) 
            }            
        } else {
            message.warning("Та санал өгөхийн тулд эхлээд нэвтэрч орно уу.")                        
        }                
    }

    function onNameChange(e) {                
        setName(e.target.value)
    }

    function addOption() {        
        if (props.token) {        
            if (name && name.length > 0) {
                const data = {        
                    "name": name,
                    "token": props.token
                }
                axios({
                    method: 'POST',
                    url: `${api.vote_options}/`,
                    data: data
                })            
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        message.info("Таны саналыг бүртгэж авлаа.")   
                        getVoteResult();
                    }                                            
                })
                .catch(err => {                        
                    if (err.message.endsWith("406")) {
                        message.warning("Энэ санал аль хэдийн бүртгэгдсэн байна. Та жагсаалтаа дахин шалгана уу.")
                    } else {
                        message.error("Амжилтгүй боллоо. Та дахин оролдоно уу.")
                    }                                
                }) 
            }    
            else {
                message.warning("Санал болгох номын нэр хоосон байж болохгүй.")
            }
        } else {
            message.warning("Та санал өгөхийн тулд эхлээд нэвтэрч орно уу.")            
        }        
    }

    return (
        <div>
            <Card 
                title="Санал асуулга"                                 
                bordered={false} 
                style={{ width: '100%', height: '100%' }}
            >             
                <div style={{ margin: '16px' }}>
                    <Countdown title="Дуусах хугацаа:" value={deadline} format="D өдөр H цаг m мин s сек" valueStyle={{ fontSize: '16px' }} />
                </div>
                {voteSelect ? (
                    <Table columns={columns} dataSource={getVoteOptions(voteSelect.options)} showHeader={false} pagination={{ pageSize: 8, }} />
                ) : (
                    <></>
                )}           
                <div style={{ padding: '0 16px' }}>
                    <p>Шинэ ном санал болгох:</p>
                    <Row gutter={8}>
                        <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>                            
                            <PlusCircleFilled style={{ fontSize: '18px', color: '#1890ff' }} />                            
                        </Col>
                        <Col span={21}>
                            <Input placeholder="Harry Potter" onChange={onNameChange} onPressEnter={addOption} />
                            {/* <Popconfirm title={`${name} номыг санал болгох уу?`} okText="Тийм" cancelText="Үгүй" onConfirm={addOption}>
                                <Button type="primary" disabled={disabled}>
                                    Бүртгэх
                                </Button>
                            </Popconfirm> */}
                        </Col>
                    </Row>    
                </div>                                                                    
            </Card> 
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default withRouter(connect(mapStateToProps)(Vote));