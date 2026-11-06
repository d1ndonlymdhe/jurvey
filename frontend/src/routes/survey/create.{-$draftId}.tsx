import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from "react";
import {
    Container,
    LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { LoadingState } from "../../slices/surveysSlice.ts";
import {
    createFromDraft,
    DraftDataPoint,
    DraftSurvey,
    editFromDraft,
    fetchDetailedSurvey,
    NewDraftSelectDatapoint,
    NewDraftSurvey,
    NewDraftTextDataPoint,
    saveDraftSurvey,
    selectDraftSurveyWithId
} from "../../slices/draftSurveySlice.ts";
import { Input } from "@/components/ui/input.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card.tsx";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { DndContext } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


export const Route = createFileRoute('/survey/create/{-$draftId}')({
    component: RouteComponent,
})

function RouteComponent() {
    const { draftId } = Route.useParams();
    const navigate = useNavigate();

    const [isAddTextQuestionModalOpen, {
        open: openAddTextQuestionModal,
        close: closeAddTextQuestionModal
    }] = useDisclosure(false)
    const [isAddSelectQuestionModalOpen, {
        open: openAddSelectQuestionModal,
        close: closeAddSelectQuestionModal
    }] = useDisclosure(false);
    const dispatch = useAppDispatch()
    const selectedDraft = useAppSelector(state => selectDraftSurveyWithId(state, draftId || null))
    const [draftSurveyEditCopy, setDraftSurveyEditCopy] = useState<DraftSurvey | undefined>(!draftId ? selectedDraft ? selectedDraft : NewDraftSurvey() : undefined)
    const [draftSurveyOriginalCopy, setDraftSurveyOriginal] = useState<DraftSurvey | undefined>(draftSurveyEditCopy);

    const resolveEditSurveyPositions = useCallback(() => {
        if (draftSurveyEditCopy && draftSurveyOriginalCopy) {

            const editDataPoints = Object.values(draftSurveyEditCopy.dataPoints).filter(dp => draftSurveyOriginalCopy.dataPoints[dp.draftId]).map(dp => {
                const originalPosition = draftSurveyOriginalCopy.dataPoints[dp.draftId];
                return {
                    ...dp,
                    position: originalPosition
                }
            })
            return editDataPoints;
        }
    }, [draftSurveyEditCopy, draftSurveyOriginalCopy])

    const saveAsDraft = useCallback(() => {
        if (draftSurveyEditCopy) {
            const resolvedDataPoints = resolveEditSurveyPositions();
            const resolvedDraftSurvey = {
                ...draftSurveyEditCopy,
                dataPoints: resolvedDataPoints ? Object.fromEntries(resolvedDataPoints.map(dp => [dp.id, dp])) : {},
            }
            dispatch(saveDraftSurvey(resolvedDraftSurvey))
            return resolvedDraftSurvey;
        }
    }, [draftId, draftSurveyEditCopy])

    useEffect(() => {
        if (draftId) {
            if (!selectedDraft) {
                void dispatch(fetchDetailedSurvey(draftId))
            }
            if (selectedDraft) {
                setDraftSurveyEditCopy(selectedDraft);
                setDraftSurveyOriginal(selectedDraft);
            }
        }
    }, [draftId, selectedDraft])

    const submitDraft = useCallback(() => {
        const resolvedDraft = saveAsDraft();

        const saveFn = draftId ? editFromDraft : createFromDraft
        if (resolvedDraft) {
            void dispatch(saveFn(resolvedDraft)).unwrap().then(res => {
                void navigate({
                    to: "/survey/edit/$surveyId", params: {
                        surveyId: res.id
                    }
                })
            })
        }
    }, [draftSurveyEditCopy])


    const isDatapointDeletedDuringEdit = useCallback((dataPoint: NonNullable<typeof draftSurveyEditCopy>["dataPoints"][number]) => {
        const existsInEditCopy = draftSurveyEditCopy?.dataPoints[dataPoint.draftId];
        const existsInOriginalCopy = draftSurveyOriginalCopy?.dataPoints[dataPoint.draftId];
        if (existsInEditCopy && !existsInOriginalCopy) {
            setDraftSurveyOriginal((current) => {
                if (!current) {
                    return
                }
                const copy = { ...current };
                const datapointsCopy = copy?.dataPoints ? { ...copy.dataPoints } : {};
                datapointsCopy[dataPoint.draftId] = dataPoint;
                copy.dataPoints = datapointsCopy;
                return copy;
            })
            return false;
        } else if (existsInEditCopy && existsInOriginalCopy) {
            return false;
        } else if (!existsInEditCopy && existsInOriginalCopy) {
            return true;
        } else {
            return false;
        }
    }, [draftSurveyEditCopy, draftSurveyOriginalCopy, setDraftSurveyOriginal])

    const draftLoading = draftId ? !selectedDraft || selectedDraft.syncStatus == LoadingState.LOADING : false
    const submitLoading = draftSurveyEditCopy ? draftSurveyEditCopy.syncStatus == LoadingState.LOADING : false;

    const addDataPointToDraftSurvey = useCallback((dataPoint: DraftDataPoint) => {
        setDraftSurveyEditCopy((currentDraftSurvey) => {
            currentDraftSurvey = currentDraftSurvey!;
            return {
                ...currentDraftSurvey,
                dataPoints: currentDraftSurvey?.dataPoints ? {
                    ...currentDraftSurvey?.dataPoints,
                    [dataPoint.draftId]: dataPoint
                } : {},
                questionCount: currentDraftSurvey?.questionCount ? currentDraftSurvey?.questionCount + 1 : 1
            }
        })
        setDraftSurveyOriginal((currentDraftSurvey) => {
            currentDraftSurvey = currentDraftSurvey!;
            return {
                ...currentDraftSurvey,
                dataPoints: currentDraftSurvey?.dataPoints ? {
                    ...currentDraftSurvey?.dataPoints,
                    [dataPoint.draftId]: dataPoint
                } : {},
                questionCount: currentDraftSurvey?.questionCount ? currentDraftSurvey?.questionCount + 1 : 1
            }
        })
    }, [draftSurveyOriginalCopy, draftSurveyEditCopy, setDraftSurveyOriginal, setDraftSurveyEditCopy])

    function handleDragEnd({ active, over }: {
        active: { id: string | number };
        over: { id: string | number } | null;
    }) {
        console.log("drag end", active, over)
        if (!over || active.id === over.id) return;
        if (typeof active.id !== "string" || typeof over.id !== "string") return;
        // We display only against original copy, we will update ordering in the edit copy to match the original copy at the save point.
        setDraftSurveyOriginal((currentDraftSurvey) => {
            const oldDP = currentDraftSurvey?.dataPoints[active.id]

            const newDP = currentDraftSurvey?.dataPoints[over.id];
            if (oldDP == undefined || newDP == undefined) {
                return currentDraftSurvey;
            }
            const oldDpCopy = { ...oldDP };
            const newDpCopy = { ...newDP };

            const newDataPoints = {} as Record<string, DraftDataPoint>;

            const dir = oldDpCopy.position < newDpCopy.position ? "down" : "up";
            Object.values(currentDraftSurvey!.dataPoints).forEach((dp) => {
                if (dp.draftId === oldDpCopy.draftId) {

                    newDataPoints[dp.draftId] = ({
                        ...dp,
                        position: newDpCopy.position
                    })
                } else {
                    if (dir == "down") {

                        if (dp.position <= newDpCopy.position) {
                            newDataPoints[dp.draftId] = ({
                                ...dp,
                                position: dp.position - 1
                            })
                        } else {

                            newDataPoints[dp.draftId] = dp;
                        }
                    }
                    if (dir == "up") {
                        if (dp.position >= newDpCopy.position) {
                            newDataPoints[dp.draftId] = ({
                                ...dp,
                                position: dp.position + 1
                            })
                        } else {
                            newDataPoints[dp.draftId] = dp;
                        }
                    }
                }
            })
            return {
                ...currentDraftSurvey!,
                dataPoints: newDataPoints
            }
        })
    }



    return <Container fluid px={"lg"} py={"md"}>
        <div className="flex flex-col gap-md">
            <div className="flex flex-row gap-md justify-between items-end">
                <div className="flex flex-col gap-md">
                    <p className="text-3xl">
                        Create Survey
                    </p>
                </div>
            </div>
            <Card>
                <LoadingOverlay visible={draftLoading}></LoadingOverlay>
                {
                    draftSurveyEditCopy && draftSurveyOriginalCopy &&
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <div className="flex flex-col gap-md">
                            <CardHeader>
                                <div className="flex flex-col gap-md">
                                    <Field>
                                        <FieldLabel>Survey Name</FieldLabel>
                                        <Input value={draftSurveyEditCopy.name}
                                            onChange={(e) => setDraftSurveyEditCopy({
                                                ...draftSurveyEditCopy,
                                                name: e.target.value
                                            })} />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Survey Title</FieldLabel>
                                        <Input value={draftSurveyEditCopy.title}
                                            onChange={(e) => setDraftSurveyEditCopy({
                                                ...draftSurveyEditCopy,
                                                title: e.target.value
                                            })} />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Survey Description</FieldLabel>
                                        <Textarea value={draftSurveyEditCopy.description}
                                            onChange={(e) => setDraftSurveyEditCopy({
                                                ...draftSurveyEditCopy,
                                                description: e.target.value
                                            })} />
                                    </Field>
                                </div>
                            </CardHeader>
                            <CardDescription>
                                <div className="flex flex-col gap-md">
                                    <DndContext onDragStart={(e) => {
                                        console.log(e)
                                    }} onDragEnd={(e) => {
                                        handleDragEnd({ active: e.active, over: e.over })
                                    }}>
                                        <SortableContext items={Object.values(draftSurveyOriginalCopy.dataPoints).toSorted((a, b) => a.position - b.position).map(dp => ({ id: dp.draftId }))}>
                                            {
                                                Object.values(draftSurveyOriginalCopy.dataPoints).toSorted((a, b) => a.position - b.position).map((dp) => {
                                                    const isDeleted = isDatapointDeletedDuringEdit(dp);
                                                    const currentDatapoint = draftSurveyEditCopy.dataPoints[dp.draftId] || null;
                                                    return <RenderDraftDatapoint
                                                        saveFunc={
                                                            (updatedDatapoint) => {
                                                                setDraftSurveyEditCopy((current) => {
                                                                    if (current) {
                                                                        const currentCopy = { ...current };
                                                                        currentCopy.dataPoints = currentCopy?.dataPoints ? { ...currentCopy.dataPoints, [updatedDatapoint.draftId]: updatedDatapoint } : {};
                                                                        return currentCopy
                                                                    }
                                                                })
                                                            }
                                                        }
                                                        recoverFunc={() => {
                                                            if (isDeleted) {
                                                                const original = draftSurveyOriginalCopy.dataPoints[dp.draftId];
                                                                if (original) {
                                                                    setDraftSurveyEditCopy((current) => {
                                                                        if (current) {
                                                                            const currentCopy = { ...current };
                                                                            currentCopy.dataPoints = currentCopy?.dataPoints ? { ...currentCopy.dataPoints, [original.draftId]: { ...original } } : { [original.draftId]: { ...original } };
                                                                            currentCopy.questionCount++;
                                                                            return currentCopy
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }}
                                                        deleteFunc={() => {
                                                            if (!isDeleted) {
                                                                setDraftSurveyEditCopy((current) => {
                                                                    if (current) {
                                                                        const currentCopy = { ...current };
                                                                        currentCopy.dataPoints = currentCopy?.dataPoints ? { ...currentCopy.dataPoints } : {};
                                                                        delete currentCopy.dataPoints[dp.draftId];
                                                                        currentCopy.questionCount--;
                                                                        return currentCopy
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                        currentDatapoint={currentDatapoint}
                                                        originalDatapoint={dp}
                                                        key={dp.draftId} />
                                                })
                                            }
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </CardDescription>
                            <CardAction>
                                <div className="flex flex-col gap-md">
                                    <div className="flex flex-row gap-md">
                                        <Button onClick={openAddTextQuestionModal} type={"button"}>
                                            Add Text Question
                                        </Button>
                                        <Button onClick={openAddSelectQuestionModal} type={"button"}>
                                            Add Select Question
                                        </Button>
                                    </div>


                                    <Dialog open={isAddTextQuestionModalOpen}>
                                        <DialogContent>
                                            <ManageTextDataPoint
                                                init={null}
                                                saveFunc={(label) => {
                                                    const currentDraftSurvey = draftSurveyEditCopy!;
                                                    if (currentDraftSurvey) {
                                                        const newDp = NewDraftTextDataPoint(label, currentDraftSurvey.draftId, currentDraftSurvey?.dataPoints ? Object.keys(currentDraftSurvey.dataPoints).length : 0);
                                                        addDataPointToDraftSurvey(newDp);
                                                    }

                                                }} closeFunc={closeAddTextQuestionModal} />
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog open={isAddSelectQuestionModalOpen}>

                                        <ManageSelectDataPoint
                                            init={null}
                                            saveFn={(label, allowedValues) => {
                                                const currentDraftSurvey = draftSurveyEditCopy!;

                                                if (currentDraftSurvey) {
                                                    const newDp = NewDraftSelectDatapoint(label, allowedValues, currentDraftSurvey.draftId, currentDraftSurvey?.dataPoints ? Object.keys(currentDraftSurvey.dataPoints).length : 0);
                                                    addDataPointToDraftSurvey(newDp);
                                                }

                                            }} closeFn={closeAddSelectQuestionModal} />
                                    </Dialog>

                                    <div className="flex flex-row gap-md justify-start">
                                        <Button
                                            size="lg"
                                            type="button"
                                            disabled={submitLoading}
                                            onClick={submitDraft}
                                        >
                                            {
                                                submitLoading ?
                                                    <>
                                                        <Spinner data-icon="inline-start" />
                                                        Submitting...
                                                    </> : "Submit"
                                            }
                                        </Button>
                                        <Button
                                            size="lg"
                                            type="button"
                                            disabled={submitLoading}
                                            onClick={saveAsDraft}
                                        >
                                            {
                                                submitLoading ?
                                                    <>
                                                        <Spinner data-icon="inline-start" />
                                                        Saving...
                                                    </> : "Save as Draft"
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </CardAction>
                        </div>
                    </form>
                }
            </Card>
        </div>
    </Container>
}

function RenderTextDatapoint({ originalDatapoint, saveFn }: Readonly<{
    originalDatapoint: {
        label: string
    },
    currentDatapoint: {
        label: string
    } | null,
    saveFn: (label: string) => void,
}>) {
    const [isEditModalOpen, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    return <>
        <div className="flex flex-row gap-md">
            <Field>
                <FieldLabel>{originalDatapoint.label}</FieldLabel>
                <Input />
            </Field>
            <Button type={"button"} onClick={() => {
                openEditModal()
            }}>
                Edit
            </Button>
        </div>
        <Dialog open={isEditModalOpen} >
            <ManageTextDataPoint
                init={originalDatapoint}
                closeFunc={closeEditModal}
                saveFunc={saveFn}
            ></ManageTextDataPoint>
        </Dialog>

    </>
}

function RenderSelectDatapoint({ datapoint }: Readonly<{
    datapoint: {
        label: string,
        allowedValues: string[]
    }
}>) {

    return <Select items={datapoint.allowedValues.map((v) => ({ label: v, value: v }))}>
        <SelectTrigger>
            <SelectValue placeholder={datapoint.label} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {
                    datapoint.allowedValues.map((item, idx) => {
                        return <SelectItem key={item + idx} value={item}>{item}</SelectItem>
                    })
                }
            </SelectGroup>
        </SelectContent>
    </Select>
}



function RenderDraftDatapoint({ currentDatapoint, originalDatapoint, deleteFunc, recoverFunc, saveFunc }: Readonly<{
    currentDatapoint: DraftDataPoint | null,
    originalDatapoint: DraftDataPoint,
    deleteFunc: () => void,
    recoverFunc: () => void,
    saveFunc: (datapoint: DraftDataPoint) => void,
}>) {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: originalDatapoint.draftId });
    const isDeleted = currentDatapoint == null;
    const DataPoint = useCallback(() => {
        if (originalDatapoint.type == "text") {
            return <RenderTextDatapoint
                originalDatapoint={originalDatapoint}
                currentDatapoint={currentDatapoint}
                saveFn={(label) => {
                    saveFunc({
                        ...originalDatapoint,
                        label: label
                    })
                }}
            />
        }
        if (originalDatapoint.type == "select") {
            return <RenderSelectDatapoint datapoint={originalDatapoint} />
        }
        return null;
    }, [originalDatapoint, deleteFunc])
    return <div className="flex flex-row gap-md"
        ref={setNodeRef}
        style={{
            transform: CSS.Transform.toString(transform),
            transition,
        }}

    >
        <button {...attributes} {...listeners} style={{ touchAction: "none" }}>
            ⠿
        </button>
        <DataPoint />
        {
            !isDeleted &&
            <Button type={"button"} onClick={() => {
                deleteFunc()
            }}>
                DELETE
            </Button>
        }
        {
            isDeleted &&
            <Button type={"button"} onClick={() => {
                recoverFunc()
            }}>
                UNDO
            </Button>
        }
    </div>
}

function ManageTextDataPoint({ saveFunc, closeFunc, init }: Readonly<{
    saveFunc: (label: string) => void,
    closeFunc: () => void,
    init: {
        label: string
    } | null
}>) {

    const [label, setLabel] = useState(init ? init.label : "")

    return <Container fluid px={"lg"} py={"md"}>
        <form onSubmit={(e) => {
            e.preventDefault();
            saveFunc(label);
            closeFunc()
        }}>
            <div className="flex flex-col gap-md">
                <Field>
                    <FieldLabel>Enter Question</FieldLabel>
                    <Input value={label} onChange={(e) => {
                        setLabel(e.target.value)
                    }} />
                </Field>
                <Button type={"submit"}>
                    Submit
                </Button>
            </div>
        </form>
    </Container>
}

function ManageSelectDataPoint({ saveFn, closeFn, init }: Readonly<{
    saveFn: (label: string, allowedValues: string[]) => void,
    closeFn: () => void,
    init: {
        label: string,
        allowedValues: string[]
    } | null
}>) {
    const [label, setLabel] = useState(init ? init.label : "");
    const [allowedValues, setAllowedValues] = useState(init ? init.allowedValues : [] as string[]);

    return <Container fluid px={"lg"} py={"md"}>
        <form onSubmit={(e) => {
            e.preventDefault();
            saveFn(label, allowedValues)
            closeFn()
        }}>
            <div className="flex flex-col gap-md">
                <Field>
                    <FieldLabel>
                        Enter question
                    </FieldLabel>
                    <Input value={label} onChange={(e) => {
                        setLabel(e.target.value)
                    }} />
                </Field>
                {
                    allowedValues.map((allowedValue, idx) => {
                        return <div className="flex flex-row gap-md" key={allowedValue + idx}>
                            <Field>
                                <FieldLabel>ALlowed values for select</FieldLabel>
                                <Input value={allowedValue} onChange={(e) => {
                                    const copy = [...allowedValues];
                                    copy[idx] = e.target.value;
                                    setAllowedValues(copy)
                                }}></Input>
                            </Field>
                            <Button type={"button"} onClick={() => {
                                setAllowedValues(allowedValues.filter((_, i) =>
                                    i != idx
                                ))
                            }}>
                                Remove value
                            </Button>
                        </div>
                    })
                }
                <Button type={"button"} onClick={() => {
                    setAllowedValues([...allowedValues, "Select Value"])
                }}>
                    Add Value
                </Button>
                <Button type={"submit"}>
                    Submit
                </Button>
            </div>
        </form>
    </Container>
}