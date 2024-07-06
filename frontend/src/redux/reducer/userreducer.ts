import {createSlice } from "@reduxjs/toolkit";
const initialState= {
user:null,
loading:true,
};
export const userReducer= createSlice({
    name:"userReducer",
    initialState,
    reducers:{
        userexist:(state,action)=>{
            state.loading=false;
            state.user=action.payload;
        },
        usernotexist:(state)=>{
            state.loading=false;
            state.user=null;
        }
    }
})
export const {userexist,usernotexist}= userReducer.actions;