import React, { useEffect, useState } from 'react';
import { Breadcrumb, Grid, Button, Result, Tabs } from 'antd';
import { EditOutlined, QrcodeOutlined, ReadOutlined, TagsOutlined, TeamOutlined, DiffOutlined, FormOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import api from '../api';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BookAdd from '../book/BookAdd';
import CategoryAdd from '../category/CategoryAdd';
import CategoryUpdate from '../category/CategoryUpdate';
import CategoryDelete from '../category/CategoryDelete';
import AuthorAdd from '../author/AuthorAdd';
import AuthorUpdate from '../author/AuthorUpdate';
import AuthorDelete from '../author/AuthorDelete';
import CustomerAdd from '../customer/CustomerAdd';
import CustomerUpdate from '../customer/CustomerUpdate';
import CustomerDelete from '../customer/CustomerDelete';
import BookUpdate from '../book/BookUpdate';
import BookDelete from '../book/BookDelete';
import OrderAdd from '../order/OrderAdd';
import OrderFinish from '../order/OrderFinish';

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

function Staff (props) {
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

    return (
        <div>            
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Нүүр</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Ажилтны цонх
                </Breadcrumb.Item>
            </Breadcrumb>
            { user && (user.profile.role === "2" || user.profile.role === "1") ? (
                <div style={{ margin: '16px 0', background: '#fff', padding: '16px' }}>
                    <Tabs defaultActiveKey={1}>
                        <TabPane key={1} tab={<span><QrcodeOutlined />Захиалга</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <OrderAdd />
                                </TabPane>
                                <TabPane tab={<span><CheckCircleOutlined />{screens.xs ? '' : 'Захиалга хаах'}</span>} key="update">
                                    <OrderFinish />
                                </TabPane>
                            </Tabs>
                        </TabPane>  
                        <TabPane key={2} tab={<span><ReadOutlined />Ном</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <BookAdd />
                                </TabPane>
                                <TabPane tab={<span><FormOutlined />{screens.xs ? '' : 'Засварлах'}</span>} key="update">
                                    <BookUpdate />
                                </TabPane>
                                <TabPane tab={<span><DeleteOutlined />{screens.xs ? '' : 'Устгах'}</span>} key="delete">
                                    <BookDelete />
                                </TabPane>
                            </Tabs>
                        </TabPane> 
                        <TabPane key={3} tab={<span><TagsOutlined />Ангилал</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <CategoryAdd />
                                </TabPane>
                                <TabPane tab={<span><FormOutlined />{screens.xs ? '' : 'Засварлах'}</span>} key="update">
                                    <CategoryUpdate />
                                </TabPane>
                                <TabPane tab={<span><DeleteOutlined />{screens.xs ? '' : 'Устгах'}</span>} key="delete">
                                    <CategoryDelete />
                                </TabPane>
                            </Tabs>
                        </TabPane> 
                        <TabPane key={4} tab={<span><EditOutlined />Зохиолч</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <AuthorAdd />
                                </TabPane>
                                <TabPane tab={<span><FormOutlined />{screens.xs ? '' : 'Засварлах'}</span>} key="update">
                                    <AuthorUpdate />
                                </TabPane>
                                <TabPane tab={<span><DeleteOutlined />{screens.xs ? '' : 'Устгах'}</span>} key="delete">
                                    <AuthorDelete />
                                </TabPane>
                            </Tabs>
                        </TabPane> 
                        {/* <TabPane key={5} tab={<span><ShopOutlined />Компани</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <PublisherAdd />
                                </TabPane>
                                <TabPane tab={<span><FormOutlined />{screens.xs ? '' : 'Засварлах'}</span>} key="update">
                                    <PublisherUpdate />
                                </TabPane>
                                <TabPane tab={<span><DeleteOutlined />{screens.xs ? '' : 'Устгах'}</span>} key="delete">
                                    <PublisherDelete />
                                </TabPane>
                            </Tabs>
                        </TabPane>  */}
                        <TabPane key={5} tab={<span><TeamOutlined />Хэрэглэгч</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><DiffOutlined />{screens.xs ? '' : 'Шинээр бүртгэх'}</span>} key="add">
                                    <CustomerAdd />
                                </TabPane>
                                <TabPane tab={<span><FormOutlined />{screens.xs ? '' : 'Засварлах'}</span>} key="update">
                                    <CustomerUpdate />
                                </TabPane>
                                <TabPane tab={<span><DeleteOutlined />{screens.xs ? '' : 'Устгах'}</span>} key="delete">
                                    <CustomerDelete />
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

export default withRouter(connect(mapStateToProps)(Staff));