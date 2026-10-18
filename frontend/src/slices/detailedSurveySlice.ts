import {
    AddTextDataPointRequest,
    DetailedSurveyResDTO,
    SelectDataPointDTO, TextDataPointDTO
} from "../api/data-contracts.ts";
import {LoadingState, LoadingStateType, SurveyAPI} from "./surveysSlice.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

type DetailedSurveyItem = {
    surveyId: string,
    data: DetailedSurveyResDTO | null,
    status: LoadingStateType,
    errorMsg: string | null,
}

const initialState = {
    items: [] as DetailedSurveyItem[]
}

export const fetchDetailedSurvey = createAsyncThunk<DetailedSurveyResDTO, string>("surveys/detailed/fetch", async (surveyId) => {
    return await SurveyAPI.getSurvey(surveyId);
})

export const createTextDatapoint = createAsyncThunk<SelectDataPointDTO | TextDataPointDTO,AddTextDataPointRequest>("surveys/detailed/datapoint/text/create", async (req)=>{
    return await SurveyAPI.createTextDataPoint(req);
})

export const detailedSurveySlice = createSlice({
    name: 'detailedSurvey',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchDetailedSurvey.pending, (state, action) => {
                    const surveyId = action.meta.arg;
                    const alreadyIncluded = state.items.find(d => d.surveyId == action.meta.arg)
                    if (!alreadyIncluded) {
                        state.items.push({
                            surveyId,
                            data: null,
                            status: LoadingState.LOADING,
                            errorMsg: null,
                        })
                    } else {
                        alreadyIncluded.data = null;
                        alreadyIncluded.status = LoadingState.LOADING;
                        alreadyIncluded.errorMsg = null;
                    }
                }
            )
            .addCase(fetchDetailedSurvey.fulfilled, (state, action) => {
                    const res = action.payload;
                    const alreadyIncluded = state.items.find(d => d.surveyId == res.id);
                    if (!alreadyIncluded) {
                        state.items.push({
                            surveyId: res.id,
                            data: res,
                            status: LoadingState.LOADED,
                            errorMsg: null
                        })
                    } else {
                        alreadyIncluded.data = res;
                        alreadyIncluded.status = LoadingState.LOADED;
                        alreadyIncluded.errorMsg = null;
                    }
                }
            )
            .addCase(fetchDetailedSurvey.rejected, (state, action)=>{
                const surveyId = action.meta.arg;
                const alreadyIncluded = state.items.find(d => d.surveyId == surveyId);
                if (!alreadyIncluded) {
                    state.items.push({
                        surveyId: surveyId,
                        data: null,
                        status: LoadingState.ERROR,
                        errorMsg: action.error.message || null
                    })
                } else {
                    alreadyIncluded.data = null;
                    alreadyIncluded.status = LoadingState.ERROR;
                    alreadyIncluded.errorMsg = action.error.message || null;

                }
            })
            .addCase(createTextDatapoint.fulfilled, (state,action)=>{
                const res = action.payload;
                const surveyId = res.surveyId;
                const alreadyIncluded = state.items.find(d => d.surveyId == surveyId);
                if (alreadyIncluded) {
                   if(alreadyIncluded.data){
                        const dpAlreadyIncluded = alreadyIncluded.data.dataPoints.find(d=>d.id == res.id);
                        if(!dpAlreadyIncluded){
                            alreadyIncluded.data.dataPoints.push(res);
                        }
                   }
                }

            })

    }
})

export default detailedSurveySlice.reducer;