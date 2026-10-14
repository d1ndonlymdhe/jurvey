import {configureStore}  from "@reduxjs/toolkit";
import surveyReducer from "./slices/surveysSlice.ts";
import detailedSurveyReducer from "./slices/detailedSurveySlice.ts"
export const store = configureStore({
    reducer:{
        surveys: surveyReducer,
        detailedSurvey: detailedSurveyReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
