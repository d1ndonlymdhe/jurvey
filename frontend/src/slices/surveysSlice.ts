import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {BasicSurveyResDTO, CreateSurveyRequest} from "../api/data-contracts.ts";
import {Survey} from "../api/Survey.ts";
import {createTextDatapoint} from "./detailedSurveySlice.ts";


export const LoadingState = {
    "IDLE": 'IDLE',
    'LOADING': 'LOADING',
    'LOADED': 'LOADED',
    'ERROR': 'ERROR'
} as const

export type LoadingStateType = typeof LoadingState[keyof typeof LoadingState];

const initialState = {
    status: LoadingState.IDLE as LoadingStateType,
    errorMsg: null as null | string,
    data: [] as BasicSurveyResDTO[]
};

export const SurveyAPI = new Survey({
    baseURL: "http://localhost:8080"
})

export const fetchSurveys = createAsyncThunk("surveys/fetch", async () => {
    return await SurveyAPI.getAllSurvey();
})

export const createSurvey = createAsyncThunk<BasicSurveyResDTO, CreateSurveyRequest>("survyes/create", async (req) => {
    return await SurveyAPI.createSurvey(req);
})

export const surveysSlice = createSlice({
    name: 'surveys',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchSurveys.pending, (state) => {
                    state.status = LoadingState.LOADING
                }
            )
            .addCase(fetchSurveys.fulfilled, (state, action) => {
                state.status = LoadingState.LOADED
                state.data = action.payload;
            })
            .addCase(fetchSurveys.rejected, (state, action) => {
                state.status = LoadingState.ERROR;
                state.errorMsg = action.error.message || null
            })
            .addCase(createSurvey.fulfilled, (state, action) => {
                const alreadyIncluded = state.data.some(d => d.id == action.payload.id);
                if (!alreadyIncluded) {
                    state.data.push(
                        action.payload
                    )
                }
            })
            .addCase(createTextDatapoint.fulfilled, (state, action)=>{
                const surveyId = action.meta.arg.surveyId;
                const alreadyIncluded = state.data.find(d=>d.id == surveyId);
                if(alreadyIncluded){
                    alreadyIncluded.questionCount++;
                }
            })

    }


})

export default surveysSlice.reducer;