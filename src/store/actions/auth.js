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

export const passwordChange = (oldpassword, password1, password2, token) => {    
    return dispatch => {
        axios({
            method: 'POST',
            url: api.passwordchange,
            data: {                
                new_password1: password1,
                new_password2: password2,
                old_password: oldpassword            
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(res => {            
            message.info("Таны нууц үг солигдлоо.")                   
        }).catch(err => {
            if (err.message.toString().endsWith("400")) {
                message.error("Та нууц үгээ зөв оруулна уу.")
            }
        })    
    }
}

export const passwordReset = (code, password) => {    
    return dispatch => {
        const data = {
            "code": code,
            "password": password,
        }
        axios({            
            method: 'POST',
            url: `${api.resetrequests}/`,
            data: data
        }).then(res => {            
            message.info("Нууц үг сэргээх хүсэлт илгээгдлээ.")         
        }).catch(err => {
            if (err.message.toString().endsWith("406")) {
                message.error(`${code} SAP код бүхий хэрэглэгч олдсонгүй.`)
            }            
        })    
    }
}

export const passwordResetConfirm = (id) => {    
    return dispatch => {
        const data = {
            "approved": "True",
        }
        axios({            
            method: 'PUT',
            url: `${api.resetrequests}/${id}/`,
            data: data
        }).then(res => {            
            console.log(res)               
        }).catch(err => {
            console.log(err)
        })    
    }
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