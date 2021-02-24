import React, { useState, useEffect } from 'react';
import { Button, Grid, Menu, Input } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { HomeOutlined, LoginOutlined, LogoutOutlined, MenuOutlined, ProfileOutlined, QuestionCircleOutlined, ReadOutlined, SearchOutlined, SettingOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import SubMenu from 'antd/lib/menu/SubMenu';
import axios from 'axios';
import api from '../api';
import logo_ot from './logo_ot.png';

const { useBreakpoint } = Grid;

function CustomMenu (props) {
    const screens = useBreakpoint();
    const [user, setUser] = useState();
    const [current, setCurrent] = useState();
    const [collapsed, setCollapsed] = useState(true);  
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {        
        if (props.token && props.token !== null) {
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
        } else {
            setUser(undefined)
        }
    }, [props.token])

    const handleMenuClick = (e) => {        
        if (e.key === 'search') {
            return;
        }        
        setCurrent(e.key);
        setCollapsed(true);
        setSearchValue('');
    };

    const handleMenuCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const onSearchChange = e => {
        setSearchValue(e.target.value);
    }

    const onSearch = e => {        
        var name = e.target.value;
        props.history.push(`/books?search=${name}`)
    }    

    return (
        <div>
            <div className="logo" style={{ marginLeft: '5%' }}>
                <img src={logo_ot} alt="logo" style={{ height: '100%', width: 'auto', marginRight: '16px' }} />
                <span> E-Library</span>
            </div>
            { screens.xs ? (
                <div>
                    <Button type="primary" onClick={handleMenuCollapsed} style={{ float: 'right', marginTop: '5%', marginRight: '5%' }}>
                        <MenuOutlined />
                    </Button>
                    <Menu 
                        className="menu" 
                        theme={props.darkMode ? "dark" : "light"} 
                        mode="inline" hidden={collapsed} 
                        onClick={handleMenuClick}
                        defaultSelectedKeys={[current]}
                    >
                        <Menu.Item key="home" icon={<HomeOutlined />}>
                            <Link to="/">Нүүр</Link>
                        </Menu.Item>
                        <Menu.Item key="books" icon={<ReadOutlined />}>
                            <Link to="/books">Ном</Link>
                        </Menu.Item>
                        <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                            <Link to="/help">Тусламж</Link>
                        </Menu.Item>                   
                        { user && user !== null ? (
                            <SubMenu key="user" icon={<UserOutlined />} title={user.username} >
                                { user.profile.role === "1" ? (
                                    <>
                                        <Menu.Item key="admin" icon={<SettingOutlined />} >
                                            <Link to="/admin">Админ цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="staff" icon={<ToolOutlined />} >
                                            <Link to="/staff">Ажилтны цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="customer" icon={<ProfileOutlined />} >
                                            <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                        </Menu.Item>
                                    </>
                                ) : user.profile.role === "2" ? (
                                    <>
                                        <Menu.Item key="staff" icon={<ToolOutlined />} >
                                            <Link to="/staff">Ажилтны цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="profile" icon={<ProfileOutlined />} >
                                            <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                        </Menu.Item>
                                    </>
                                ) : (
                                    <Menu.Item key="profile" icon={<ProfileOutlined />} >
                                        <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                    </Menu.Item>
                                )}                            
                                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                                    <Link to="/logout">Гарах</Link>
                                </Menu.Item>
                            </SubMenu>
                        ) : (
                            <Menu.Item key="login" icon={<LoginOutlined />} >
                                <Link to="/login">Нэвтрэх</Link>
                            </Menu.Item>
                        ) }    
                        <Input 
                            placeholder="Ном хайх.."
                            allowClear
                            prefix={<SearchOutlined />}
                            style={{ width: 200, margin: '16px' }}
                            onChange={onSearchChange}
                            onPressEnter={onSearch}
                            value={searchValue}                                                                       
                        />                      
                    </Menu>
                </div>
            ) : (
                <Menu 
                    className="menu" 
                    theme={props.darkMode ? "dark" : "light"} 
                    mode="horizontal" 
                    onClick={handleMenuClick} 
                    defaultSelectedKeys={[current]} 
                    style={{ marginRight: '5%' }}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/">Нүүр</Link>
                    </Menu.Item>
                    <Menu.Item key="books" icon={<ReadOutlined />}>
                        <Link to="/books">Ном</Link>
                    </Menu.Item>
                    <Menu.Item key="help" icon={<QuestionCircleOutlined />}>
                        <Link to="/help">Тусламж</Link>
                    </Menu.Item>                   
                    { user && user !== null ? (
                        <SubMenu key="user" icon={<UserOutlined />} title={user.username} style={{ float: 'right' }} >
                            { user.profile.role === "1" ? (
                                    <>
                                        <Menu.Item key="admin" icon={<SettingOutlined />} >
                                            <Link to="/admin">Админ цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="staff" icon={<ToolOutlined />} >
                                            <Link to="/staff">Ажилтны цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="profile" icon={<ProfileOutlined />} >
                                            <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                        </Menu.Item>
                                    </>
                                ) : user.profile.role === "2" ? (
                                    <>
                                        <Menu.Item key="staff" icon={<ToolOutlined />} >
                                            <Link to="/staff">Ажилтны цонх</Link>
                                        </Menu.Item>
                                        <Menu.Item key="profile" icon={<ProfileOutlined />} >
                                            <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                        </Menu.Item>
                                    </>
                                ) : (
                                    <Menu.Item key="profile" icon={<ProfileOutlined />} >
                                        <Link to="/profile">Хэрэглэгчийн цонх</Link>
                                    </Menu.Item>
                                )}                         
                            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                                <Link to="/logout">Гарах</Link>
                            </Menu.Item>
                        </SubMenu>
                    ) : (
                        <Menu.Item key="login" icon={<LoginOutlined />} style={{ float: 'right' }} >
                            <Link to="/login">Нэвтрэх</Link>
                        </Menu.Item>
                    ) }    
                    <Input 
                        placeholder="Ном хайх..."
                        allowClear
                        prefix={<SearchOutlined />}
                        style={{ width: 200, float: 'right', margin: '16px' }}
                        onChange={onSearchChange}
                        onPressEnter={onSearch}
                        value={searchValue}                                                                       
                    />               
                </Menu>
            )}                
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default withRouter(connect(mapStateToProps)(CustomMenu));