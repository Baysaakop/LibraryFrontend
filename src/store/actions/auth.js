import * as actionTypes from './actionTypes';
import axios from 'axios';
import api from '../../api';
import { message } from 'antd';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,        
    };
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {            
            dispatch(logout());
        }, expirationTime * 1000)
    };
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.signin, {
            username: username,
            password: password
        })
        .then(res => {            
            const token = res.data.key;
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(response => {                     
                let user = response.data;
                console.log(user);
                if (user.profile.verified === true) {
                    localStorage.setItem('token', token);
                    dispatch(authSuccess(token));
                } else {
                    message.warning("Таны мэдээллийг шалгаж байна. Баталгаажуултал түр хүлээнэ үү.");
                    dispatch(authFail("Account not approved"));
                }                   
            }).catch(error => {
                dispatch(authFail(error));
                message.error("Алдаа гарлаа. Дахин оролдоно уу.")
                console.log(error)
            })
        })
        .catch(err => {
            dispatch(authFail(err));
            if (err.message.includes("400")) {
                message.error("SAP код эсвэл нууц үг буруу байна!")
            } else if (err.message.includes("500")) {
                message.error("Уучлаарай, серверийн алдаа гарлаа. Та дараа дахин оролдоно уу.")
            } else {
                message.error("Алдаа гарлаа. Дахин оролдоно уу.")
                console.log(err)
            }
        })
    }
}

export const authSignup = (username, firstname, lastname, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.signup, {
            username: username,  
            first_name: firstname,  
            last_name: lastname,            
            password1: password1,
            password2: password2
        })
        .then(res => {
            message.info("Таны хүсэлтийг админ руу илгээлээ. Админ зөвшөөрөл олгосны дараа та нэвтрэх боломжтой болно.", 5);
        })
        .catch(err => {
            dispatch(authFail(err))
            if (err.message.includes("400")) {
                message.error("SAP код бүртгэлтэй байна!")
            } else if (err.message.includes("500")) {
                message.error("Уучлаарай, серверийн алдаа гарлаа. Та дараа дахин оролдоно уу.")
            } else {
                message.error("Алдаа гарлаа. Дахин оролдоно уу.")
                console.log(err)
            }
        })
    }
}

export const authCheckState = () => {
    return dispatch => {        
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token, username));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}