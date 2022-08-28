import React, {useReducer,createContext} from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

//check if token exist
if(localStorage.getItem('jwtToken')){
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    }else{
        initialState.user = decodedToken
    }
}


const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

function authReducer(state,action) {

    switch(action.type){
        case 'LOGIN':
            const decodedToken = jwtDecode(action.payload)
            return {
                ...state,
                user: decodedToken
            }
        case 'LOGOUT':
            return {
                ...state,
                user:null
            }
        default:
            return state
    }
}


function AuthProvider(props){
    const [state,dispatch] = useReducer(authReducer,initialState)

    function login(access_token){
        localStorage.setItem('jwtToken',access_token)
        dispatch({
            type: 'LOGIN',
            payload: access_token
        })

        props.onTokenReceived()
    }

    function logout(){
        props.client.resetStore()
        localStorage.removeItem('jwtToken')
        dispatch({
            type:'LOGOUT'
        })
    }

    return(
        <AuthContext.Provider value={{user:state.user,login,logout}} {...props} />
    )
}

export {AuthContext,AuthProvider}