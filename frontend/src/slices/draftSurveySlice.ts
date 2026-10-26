import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    DatapointDTO,
    DetailedSurveyResDTO,
} from "../api/data-contracts.ts";
import {LoadingState, LoadingStateType, SurveyAPI} from "./surveysSlice.ts";
import {createAppSelector} from "../hooks.ts";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type DraftType<T> = DistributiveOmit<T, "id"> & {
    draftId: string
    id: string | null,
    syncStatus: LoadingStateType,
    syncErrorMsg: string | null
}


export type DraftDataPoint = DraftType<DatapointDTO> & {
    position: number,
}
export type DraftSurvey = DraftType<Omit<DetailedSurveyResDTO, "dataPoints">> & {
    dataPoints: DraftDataPoint[]
}

export function NewDraftSurvey(): DraftSurvey {
    return {
        draftId: crypto.randomUUID(),
        syncStatus: LoadingState.IDLE,
        syncErrorMsg: null,
        id: null,
        name: "",
        description: "",
        title: "",
        dataPoints: [],
        questionCount: 0,
    }
}

export function NewDraftTextDataPoint(label: string, draftSurveyId: string, position: number): DraftDataPoint {
    return {
        id: null,
        draftId: crypto.randomUUID(),
        type: "text",
        surveyId: draftSurveyId,
        label: label,
        syncStatus: "IDLE",
        syncErrorMsg: null,
        position: position,
    }
}


export function NewDraftSelectDatapoint(label: string, allowedValues: string[], draftSurveyId: string, position: number): DraftDataPoint {
    return {
        id: null,
        draftId: crypto.randomUUID(),
        type: "select",
        allowedValues: allowedValues,
        surveyId: draftSurveyId,
        label: label,
        syncStatus: "IDLE",
        syncErrorMsg: null,
        position: position
    }
}

function DraftDataPointToDataPoint(draftDataPoint: DraftDataPoint): DetailedSurveyResDTO["dataPoints"][number] {
    return {
        id: draftDataPoint.id || "",
        surveyId: draftDataPoint.surveyId,
        label: draftDataPoint.label,
        type: draftDataPoint.type,
        allowedValues: (draftDataPoint.type == "select" ? draftDataPoint.allowedValues : undefined),

    }
}

function DraftSurveyToSurveyRes(draftSurvey: DraftSurvey): DetailedSurveyResDTO {
    return {
        id: draftSurvey.id || "",
        dataPoints: draftSurvey.dataPoints.map(d => DraftDataPointToDataPoint(d)),
        questionCount: draftSurvey.dataPoints.length,
        description: draftSurvey.description,
        name: draftSurvey.name,
        title: draftSurvey.title,
    }
}

export const createFromDraft = createAsyncThunk<DetailedSurveyResDTO, DraftSurvey>("surveys/draft/create", async (data: DraftSurvey) => {
    return await SurveyAPI.createFromDraft(DraftSurveyToSurveyRes(data));
})

export const editFromDraft = createAsyncThunk<DetailedSurveyResDTO, DraftSurvey>("surveys/draft/edit", async (data: DraftSurvey) => {
    const r = SurveyAPI.editSurvey(data.draftId,DraftSurveyToSurveyRes(data));
    return await r;
})

export const fetchDetailedSurvey = createAsyncThunk<DetailedSurveyResDTO, string>("surveys/detailed/fetch", async (surveyId) => {
    return await SurveyAPI.getSurvey(surveyId);
})

export const selectDraftSurveyWithId = createAppSelector([
    (state) => state.draftSurvey,
    (_state, draftSurveyId: string | null) => draftSurveyId
], (draftSurveys, draftSurveyId) => draftSurveyId ? draftSurveys.data[draftSurveyId] : undefined)

export const draftSurveySlice = createSlice({
    name: "draftSurveys",
    initialState: {
        data: {} as Record<string, DraftSurvey>
    },
    reducers: {
        saveDraftSurvey: (state, action: PayloadAction<DraftSurvey>) => {
            const {draftId} = action.payload;
            state.data[draftId] = action.payload;
            state.data[draftId].syncStatus = LoadingState.IDLE;
        },
        addDatapoint(state, action: PayloadAction<DraftDataPoint>) {
            const {surveyId, draftId} = action.payload;
            const existing = state.data[surveyId];
            if (existing) {
                const existingDatapoint = existing.dataPoints.find(d => d.draftId == draftId);
                if (!existingDatapoint) {
                    existing.dataPoints.push(action.payload)
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFromDraft.pending, (state, action) => {
                const draftSurveyId = action.meta.arg.draftId;
                const existing = state.data[draftSurveyId]
                if (existing) {
                    existing.syncStatus = "LOADING"
                }
            })
            .addCase(createFromDraft.fulfilled, (state, action) => {
                const draftSurveyId = action.meta.arg.draftId;
                const res = action.payload;
                const existing = state.data[draftSurveyId]

                if (existing) {
                    existing.syncStatus = "LOADED";
                    existing.id = res.id;
                    // Point the draftId to real id too (may break need to find correct usage)
                    existing.draftId = res.id;
                    // Later update database itself with ordering
                    existing.dataPoints = (res.dataPoints as DatapointDTO[]).map((d,idx) => {
                        return {
                            id: d.id,
                            draftId: d.id,
                            surveyId: d.surveyId,
                            type: d.type,
                            syncStatus: LoadingState.LOADED,
                            label: d.label,
                            allowedValues: d.type == "select" ? d.allowedValues : [],
                            syncErrorMsg: null,
                            position: idx
                        } satisfies DraftDataPoint
                    })
                }
            })
            .addCase(editFromDraft.pending, (state, action) => {
                const draftSurveyId = action.meta.arg.draftId;
                const existing = state.data[draftSurveyId]
                if (existing) {
                    existing.syncStatus = "LOADING"
                }
            })
            .addCase(editFromDraft.fulfilled, (state, action) => {
                const draftSurveyId = action.meta.arg.draftId;
                const res = action.payload;
                const existing = state.data[draftSurveyId]

                if (existing) {
                    existing.syncStatus = "LOADED";
                    existing.id = res.id;
                    // Point the draftId to real id too (may break need to find correct usage)
                    existing.draftId = res.id;
                    existing.dataPoints = (res.dataPoints as DatapointDTO[]).map((d,idx) => {
                        return {
                            id: d.id,
                            draftId: d.id,
                            surveyId: d.surveyId,
                            type: d.type,
                            syncStatus: LoadingState.LOADED,
                            label: d.label,
                            allowedValues: d.type == "select" ? d.allowedValues : [],
                            syncErrorMsg: null,
                            position: idx
                        } satisfies DraftDataPoint
                    })
                }
            })
            .addCase(
                fetchDetailedSurvey.pending, (state, action) => {
                    const surveyId = action.meta.arg;
                    const alreadyIncluded = state.data[surveyId];
                    if (!alreadyIncluded) {
                        state.data[surveyId] = {
                            draftId: surveyId,
                            syncStatus: LoadingState.LOADING,
                            questionCount: 0,
                            dataPoints: [],
                            syncErrorMsg: null,
                            id: surveyId,
                            description: "",
                            title: "",
                            name: "",
                        }
                    } else {
                        alreadyIncluded.syncErrorMsg = null;
                        alreadyIncluded.syncStatus = LoadingState.LOADING;
                    }
                }
            )
            .addCase(fetchDetailedSurvey.fulfilled, (state, action) => {
                    const res = action.payload;
                    const alreadyIncluded = state.data[res.id]
                    if (!alreadyIncluded) {
                        state.data[res.id] = {
                            draftId: res.id,
                            ...res,
                            syncStatus: LoadingState.LOADED,
                            syncErrorMsg: null,
                            dataPoints: res.dataPoints.map(d => {
                                return {
                                    ...d,
                                    syncErrorMsg: null,
                                    syncStatus: LoadingState.LOADED,
                                    draftId: d.id
                                } as DraftDataPoint
                            })
                        }
                    } else {
                        Object.assign(alreadyIncluded,{
                            draftId: res.id,
                            ...res,
                            syncStatus: LoadingState.LOADED,
                            syncErrorMsg: null,
                            dataPoints: res.dataPoints.map(d => {
                                return {
                                    ...d,
                                    syncErrorMsg: null,
                                    syncStatus: LoadingState.LOADED,
                                    draftId: d.id
                                } as DraftDataPoint
                            })
                        });
                    }
                }
            )
            .addCase(fetchDetailedSurvey.rejected, (state, action) => {
                const surveyId = action.meta.arg;
                const alreadyIncluded = state.data[surveyId];
                if (!alreadyIncluded) {
                    state.data[surveyId] = {
                        draftId: surveyId,
                        syncStatus: LoadingState.ERROR,
                        questionCount: 0,
                        dataPoints: [],
                        syncErrorMsg: action.error.message || null,
                        id: surveyId,
                        description: "",
                        title: "",
                        name: "",
                    }
                } else {
                    alreadyIncluded.syncStatus = LoadingState.ERROR;
                    alreadyIncluded.syncErrorMsg = action.error.message || null;

                }
            })
    },

})

export default draftSurveySlice.reducer;
export const {saveDraftSurvey} = draftSurveySlice.actions;