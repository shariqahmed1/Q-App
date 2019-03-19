import {FIREBASE_DATABASE}  from '../../constants/Functions';

const loginUser = (user) => {
    return{
        type: "ALREADY_HAVE",
        user,
    }
}

const updateUser =  (data) => async dispatch => {
        FIREBASE_DATABASE.ref('users').child(data).once('value', snap => {
            dispatch(loginUser(snap.val()))
        })
}


const isLogin = (flag) => {
    return{
        type: "IS_LOGIN",
        isLogin:flag,
    }
}

const isAccountCreate = (flag) => {
    return{
        type: "IS_ACCOUNT_CREATE",
        isAccountCreate:flag,
    }
}

export {
    loginUser,
    isAccountCreate,
    isLogin,
    updateUser
}