import React, { useEffect, useState } from 'react';
import { Breadcrumb, Grid, Button, Result, Tabs, message } from 'antd';
import { TeamOutlined, UnorderedListOutlined, PlusCircleOutlined, BarChartOutlined, UserSwitchOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RoleChange from './RoleChange';
import UserRequests from './UserRequests';

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

function Admin (props) {
    const screens = useBreakpoint();
    const [user, setUser] = useState();

    useEffect(() => {        
        axios({
            method: 'GET',
            url: api.profile,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.token}`
            }
        }).then(response => {            
            setUser(response.data)
        }).catch(error => {
            console.log(error)
        })
    }, [props.token])

    function startNewVote () {
        const data = {        
            "token": props.token
        }
        axios({
            method: 'POST',
            url: `${api.vote_selects}/`,
            data: data
        })            
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                message.info("Шинэ санал асуулгыг эхлүүллээ.")   
            }                                             
        })
        .catch(err => {                            
            message.error("Амжилтгүй боллоо. Та дахин оролдоно уу.")
        }) 
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Нүүр</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Админ цонх
                </Breadcrumb.Item>
            </Breadcrumb>
            { user && user.profile.role === "1" ? (
                <div style={{ margin: '16px 0', background: '#fff', padding: '16px' }}>
                    <Tabs defaultActiveKey={1}>
                        <TabPane key={1} tab={<span><TeamOutlined style={{ fontSize: '18px' }} />Ажилтан</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><UserAddOutlined style={{ fontSize: '18px' }} />{screens.xs ? '' : 'Шинэ хэрэглэгчийн хүсэлтүүд'}</span>} key="add">
                                    <UserRequests />
                                </TabPane>  
                                <TabPane tab={<span><UserSwitchOutlined style={{ fontSize: '18px' }} />{screens.xs ? '' : 'Ажилтны эрх солих'}</span>} key="switch">
                                    <RoleChange />
                                </TabPane>                                                               
                            </Tabs>
                        </TabPane>
                        <TabPane key={2} tab={<span><UnorderedListOutlined style={{ fontSize: '18px' }} />Санал асуулга</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><BarChartOutlined style={{ fontSize: '18px' }} />{screens.xs ? '' : 'Сүүлчийн санал асуулга'}</span>} key="view">
                                    
                                </TabPane> 
                                <TabPane tab={<span><PlusCircleOutlined style={{ fontSize: '18px' }} />{screens.xs ? '' : 'Санал асуулга эхлүүлэх'}</span>} key="add">
                                    <Result
                                        title="Шинээр сануулга асуулга эхлүүлэх товчийг дарснаар өмнөх санал асуулгыг дууссанд тооцохыг анхаарна уу."
                                        extra={
                                            <Button type="primary" key="console" onClick={startNewVote}>
                                                <PlusCircleOutlined /> Эхлүүлэх
                                            </Button>
                                        }
                                    />
                                </TabPane>                                
                            </Tabs>
                        </TabPane>  
                    </Tabs>
                </div>
            ) : (
                <Result
                    status="403"
                    title="403"
                    subTitle="Уучлаарай, танд энэ хуудас руу хандах эрх алга байна."
                    extra={<Button type="primary" href="/">Нүүр хуудас руу буцах</Button>}
                />  
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default withRouter(connect(mapStateToProps)(Admin));