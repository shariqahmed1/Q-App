const reducer = (state = {}, action) => {
    switch(action.type) {
        case "ALREADY_HAVE": {
            return {...state, user: action.user}
        }
        case "IS_LOGIN" :{
            return {...state, isLogin : action.isLogin}
        }
        case "IS_ACCOUNT_CREATE":{
            return {...state, isAccountCreate : action.isAccountCreate}
        }
        default: {
            return state;
        }
    }
}

export default reducer