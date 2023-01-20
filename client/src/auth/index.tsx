import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./auth-request-api";

let initContext: Auth = {
    auth: {
        user: null,
        loggedIn: false,
        failedLogin: false,
        failedRegister: false,
        isGuest: false,
    },
    getLoggedIn: () => {},
    registerUser: (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        passwordVerify: string
    ) => {},
    loginUser: (email: string, password: string) => {},
    logoutUser: () => {},
    getUserInitials: () => "",
    resetFailure: () => {},
    popupError: (e: string) => {},
    closeError: () => {},
    getError: () => "",
    asGuest: () => {},
};

let AuthContext: React.Context<Auth> = createContext(initContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
interface Action {
    GET_LOGGED_IN: string;
    LOGIN_USER: string;
    LOGOUT_USER: string;
    REGISTER_USER: string;
    FAILED_OPERATION: string;
    RESET_FAILED_OPERATION: string;
    CONTINUE_AS_GUEST: string;
}

export const AuthActionType: Action = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    FAILED_OPERATION: "FAILED_OPERATION",
    RESET_FAILED_OPERATION: "LOGOUT_USER",
    CONTINUE_AS_GUEST: "CONTINUE_AS_GUEST",
};

function AuthContextProvider({ children }: JSX.ElementChildrenAttribute) {
    let initialState: AuthState = {
        user: null,
        loggedIn: false,
        failedLogin: false,
        failedRegister: false,
        isGuest: false,
    };
    const [authState, setAuth] = useState(initialState);
    const [popup, setPopup] = useState("");
    const history = useNavigate();

    const authReducer = (action: { type: string; payload: any }) => {
        const { type, payload } = action;
        switch (type) {
            //TODO: whats this used for?
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    failedLogin: false,
                    failedRegister: false,
                    isGuest: false,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    failedLogin: false,
                    failedRegister: false,
                    isGuest: false,
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    failedLogin: false,
                    failedRegister: false,
                    isGuest: false,
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    failedLogin: false,
                    failedRegister: false,
                    isGuest: false,
                });
            }
            case AuthActionType.FAILED_OPERATION: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    failedLogin: payload.failedLogin ?? false,
                    failedRegister: payload.failedRegister ?? false,
                    isGuest: false,
                });
            }
            case AuthActionType.CONTINUE_AS_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    failedLogin: false,
                    failedRegister: false,
                    isGuest: true,
                });
            }
            default:
                return authState;
        }
    };

    const getLoggedIn = async function () {
        console.log("spam");
        const response = await api.getLoggedIn();
        console.log(response);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                },
            });
        }
    };

    const registerUser = async function (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        passwordVerify: string
    ) {
        // const response = await api.registerUser(
        //     firstName,
        //     lastName,
        //     email,
        //     password,
        //     passwordVerify
        // );
        api.registerUser(
            username,
            firstName,
            lastName,
            email,
            password,
            passwordVerify
        )
            .then((response) => {
                if (response.status === 200) {
                    authReducer({
                        type: AuthActionType.REGISTER_USER,
                        payload: {
                            user: response.data.user,
                        },
                    });
                    history("/playlister/");
                } else {
                    alert("got non failnig non 200 response code");
                }
            })
            .catch((reason) => {
                popupError(reason.response.data.errorMessage);
            });
    };

    const loginUser = function (email: string, password: string) {
        api.loginUser(email, password)
            .then((response) => {
                if (response.status === 200) {
                    authReducer({
                        type: AuthActionType.LOGIN_USER,
                        payload: {
                            user: response.data.user,
                        },
                    });
                    history("/playlister/");
                } else {
                    alert("got a nonfailing, non 200 code");
                }
            })
            .catch((reason) => {
                popupError(reason.response.data.errorMessage);
            });
    };

    const logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null,
            });
            history("/playlister/");
        }
    };

    const getUserInitials = function () {
        let initials = "";
        if (authState.user) {
            initials += authState.user.firstName.charAt(0);
            initials += authState.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    };

    const resetFailure = function () {
        authReducer({
            type: AuthActionType.RESET_FAILED_OPERATION,
            payload: {},
        });
    };

    const popupError = (e: string) => {
        setPopup(e);
    };

    const closeError = () => {
        setPopup("");
    };

    const getError = () => {
        return popup;
    };

    const asGuest = () => {
        authReducer({
            type: AuthActionType.CONTINUE_AS_GUEST,
            payload: {},
        });
    };

    const auth: Auth = {
        auth: authState,
        getLoggedIn: getLoggedIn,
        registerUser: registerUser,
        loginUser: loginUser,
        logoutUser: logoutUser,
        getUserInitials: getUserInitials,
        resetFailure: resetFailure,
        popupError,
        closeError,
        getError,
        asGuest,
    };

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={auth}>
            <>{children}</>
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
