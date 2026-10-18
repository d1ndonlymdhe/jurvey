import {configureStore}  from "@reduxjs/toolkit";
import surveyReducer from "./slices/surveysSlice.ts";
import detailedSurveyReducer from "./slices/detailedSurveySlice.ts"
import draftSurveyReducer from "./slices/draftSurveySlice.ts"
export const store = configureStore({
    reducer:{
        surveys: surveyReducer,
        detailedSurvey: detailedSurveyReducer,
        draftSurvey: draftSurveyReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
