import * as actionTypes from './actionTypes';
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (idToken, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: idToken,
        localId: localId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkTimeAuth = (expireTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout())
        }, expireTime * 1000)
    }
}

export const setAuthRedirectionPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECTION_PATH,
        path: path
    }
}

export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token){
            dispatch(authLogout())
        }else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate < new Date()){
                dispatch(authLogout)   
            }else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
                dispatch(checkTimeAuth((expirationDate.getTime() - new Date().getTime())/1000))
            }
        }
    }

}


export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDvrU5RqW8U86IJ5M5x4PFkGtnBk7bTZhk'
        if(!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDvrU5RqW8U86IJ5M5x4PFkGtnBk7bTZhk'
        }
        axios.post(url, authData)
        .then(response => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
            localStorage.setItem('token', response.data.idToken)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('userId', response.data.localId)
            dispatch(authSuccess(response.data.idToken, response.data.localId))
            dispatch(checkTimeAuth(response.data.expiresIn))
        })
        .catch(err => {
            dispatch(authFail(err.response.data.error.message))
        })
    }
}


