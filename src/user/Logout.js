import { Button, Result } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';

const Logout = (props) => {

    function onOk() {
        props.logout();
        // props.history.push('/');  
        //refreshPage();      
    }

    function onCancel() {
        props.history.push('/');  
    }

    if (!props.token) {
        return <Redirect to='/' />
    }

    return (
        <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Result
                status="warning"
                title="Та системээс гарахдаа итгэлтэй байна уу?"
                extra={
                    <div>
                        <Button type="primary" key="console" style={{ marginRight: '16px' }} onClick={onOk}>
                            Тийм
                        </Button>
                        <Button type="default" key="console" onClick={onCancel}>
                            Үгүй
                        </Button>
                    </div>
                }
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {        
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);