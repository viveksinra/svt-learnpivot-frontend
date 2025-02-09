'use client';
import MainReducer from "./MainReducer";
import {RESET} from "./types"

import { createContext, useEffect, useReducer, useRef } from "react"

export const MainContext = createContext()

function useEffectOnce(cb){
    const didRun = useRef(false);
    useEffect(()=>{
        if(!didRun.current){
            cb();
            didRun.current = true
        }
    })
}

const initialState = {
    isAuthenticated:false,
    token:"",
    id:"",
    firstName:"",
    lastName:"",
    userImage:"",
    jobRoleLabel:"",
    jobRoleId:"",
    userImage:"",
    mobileDrawer:false,
}

export const MainProvider =(props)=>{
    const [state, dispatch] = useReducer(MainReducer, initialState);
    useEffectOnce(()=>{
        const raw = localStorage.getItem("data");
        if(raw){
            dispatch({type:RESET, payload: JSON.parse(raw)})
        }
    })

    useEffect(()=>{
        if(state){
            localStorage.setItem("data", JSON.stringify(state))
        }
    }, [state])
    return <MainContext.Provider value={{state, dispatch}}> {props.children}</MainContext.Provider>
}

export default MainContext