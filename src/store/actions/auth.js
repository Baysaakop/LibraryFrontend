import * as actionTypes from './actionTypes';
import axios from 'axios';
import api from '../../api';
import { message } from 'antd';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (token, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
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
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');    
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
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 168);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token, username));
            dispatch(checkAuthTimeout(3600));
            message.info(`Тавтай морил, ${username}`);
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

export const authSignup = (username, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.signup, {
            username: username,            
            password1: password1,
            password2: password2
        })
        .then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 168);
            localStorage.setItem('token', token);            
            localStorage.setItem('username', username);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token, username));
            dispatch(checkAuthTimeout(3600));
            message.info(`Тавтай морил, ${username}`);
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