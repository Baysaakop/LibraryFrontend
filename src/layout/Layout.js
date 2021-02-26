import React, { useEffect, useState } from 'react';
import { Button, Layout, Tooltip } from 'antd';
import CustomMenu from './Menu';
import './Layout.css';
import { BulbFilled, BulbOutlined, FacebookFilled, GithubFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

function CustomLayout (props) {    

    // const [darkMode, setDarkMode] = useState(getInitialMode());

    // useEffect(() => {
    //     localStorage.setItem('dark', JSON.stringify(darkMode))
    // }, [darkMode])

    // function getInitialMode() {
    //     const isReturningUser = "dark" in localStorage;
    //     const savedMode = JSON.parse(localStorage.getItem('dark'));
    //     const userPrefersDark = getPrefColorScheme();
    //     if (isReturningUser) {
    //         return savedMode;
    //     } else if (userPrefersDark) {
    //         return true;
    //     } else {
    //         return false;
    //     }        
    // }

    // function getPrefColorScheme() {
    //     if (!window.matchMedia) return;

    //     return window.matchMedia("(prefers-color-scheme: dark)").matches;
    // }

    return(
        <Layout className="layout">
            <Header className="header">
                <CustomMenu />                
            </Header>
            <Content className="content">                                     
                <div className="content-item">
                    {props.children}                    
                </div>                
                {/* <div className="theme-switch-container">
                    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                        <Button 
                            type={darkMode ? "primary" : "default"}
                            shape="circle" 
                            size="large" 
                            icon={darkMode ? <BulbFilled /> : <BulbOutlined />} 
                            onClick={() => setDarkMode(prevMode => !prevMode)}
                        />
                    </Tooltip>
                </div> */}
            </Content>
            <Footer className="footer">
                <div>
                    <Tooltip title="Facebook">
                        <Button shape="circle" icon={<FacebookFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Twitter">
                        <Button shape="circle" icon={<TwitterOutlined />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Instagram">
                        <Button shape="circle" icon={<InstagramOutlined />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Youtube">
                        <Button shape="circle" icon={<YoutubeFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Github">
                        <Button shape="circle" icon={<GithubFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <p>
                        БҮР ЭРХ ХУУЛИАР ХАМГААЛАГДСАН © 2021 ОЮУ ТОЛГОЙН НОМЫН САНГИЙН СИСТЕМ.
                    </p>
                </div>                
            </Footer>
        </Layout>
    );  
};

export default CustomLayout;