import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Card,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    Modal,
    Select,
    Stack,
    Textarea,
    TextInput,
    Title
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {LoadingState} from "../../slices/surveysSlice.ts";
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


export const Route = createFileRoute('/survey/create/{-$draftId}')({
    component: RouteComponent,
})

function RouteComponent() {
    const {draftId} = Route.useParams();
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


    const saveAsDraft = useCallback(() => {
        if (draftSurveyEditCopy) {
            dispatch(saveDraftSurvey(draftSurveyEditCopy))
        }
    }, [draftId, draftSurveyEditCopy])

    useEffect(() => {
        if (draftId) {
            if (!selectedDraft) {
                dispatch(fetchDetailedSurvey(draftId))
            }
            if (selectedDraft) {
                setDraftSurveyEditCopy(selectedDraft);
                setDraftSurveyOriginal(selectedDraft);
            }
        }
    }, [draftId, selectedDraft])

    const submitDraft = useCallback(() => {
        saveAsDraft();

        const saveFn = draftId ? editFromDraft : createFromDraft
        if (draftSurveyEditCopy) {
            dispatch(saveFn(draftSurveyEditCopy)).unwrap().then(res => {
                navigate({
                    to: "/survey/edit/$surveyId", params: {
                        surveyId: res.id
                    }
                }).then()
            })
        }
    }, [draftSurveyEditCopy])


    const isDatapointDeletedDuringEdit = useCallback((dataPoint: NonNullable<typeof draftSurveyEditCopy>["dataPoints"][number]) => {
        const existsInEditCopy = draftSurveyEditCopy?.dataPoints.find(d => d.draftId == dataPoint.draftId);
        const existsInOriginalCopy = draftSurveyOriginalCopy?.dataPoints.find(d => d.draftId == dataPoint.draftId);
        if (existsInEditCopy && !existsInOriginalCopy) {
            setDraftSurveyOriginal((current) => {
                if (!current) {
                    return
                }
                const copy = {...current};
                const datapointsCopy = copy?.dataPoints ? [...copy.dataPoints] : [];
                datapointsCopy.push(dataPoint);
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
                dataPoints: currentDraftSurvey?.dataPoints ? [...currentDraftSurvey?.dataPoints, dataPoint]: [],
                questionCount: currentDraftSurvey?.questionCount? currentDraftSurvey?.questionCount + 1 : 1
            }
        })
        setDraftSurveyOriginal((currentDraftSurvey) => {
            currentDraftSurvey = currentDraftSurvey!;
            return {
                ...currentDraftSurvey,
                dataPoints: currentDraftSurvey?.dataPoints ? [...currentDraftSurvey?.dataPoints, dataPoint]: [],
                questionCount: currentDraftSurvey?.questionCount? currentDraftSurvey?.questionCount + 1 : 1
            }
        })
    }, [draftSurveyOriginalCopy, draftSurveyEditCopy, setDraftSurveyOriginal, setDraftSurveyEditCopy])


    return <Container fluid px={"lg"} py={"md"}>

        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <Title order={1}>Create Survey</Title>
                </Stack>
            </Flex>
            <Card w="60%" shadow="lg" p="xs" radius="md" withBorder pos={"relative"}>
                <LoadingOverlay visible={draftLoading}></LoadingOverlay>
                {
                    draftSurveyEditCopy && draftSurveyOriginalCopy &&
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>

                        <Stack gap={"md"}>
                            <TextInput label="Survey Name" value={draftSurveyEditCopy.name}
                                       onChange={(e) => setDraftSurveyEditCopy({
                                           ...draftSurveyEditCopy,
                                           name: e.target.value
                                       })}/>
                            <TextInput label="Survey Title" value={draftSurveyEditCopy.title}
                                       onChange={(e) => setDraftSurveyEditCopy({
                                           ...draftSurveyEditCopy,
                                           title: e.target.value
                                       })}/>
                            <Textarea label="Survey Description" value={draftSurveyEditCopy.description}
                                      onChange={(e) => setDraftSurveyEditCopy({
                                          ...draftSurveyEditCopy,
                                          description: e.target.value
                                      })}/>
                            {
                                draftSurveyOriginalCopy.dataPoints.toSorted((a, b) => a.position - b.position).map((dp) => {
                                    const isDeleted = isDatapointDeletedDuringEdit(dp);
                                    return <RenderDraftDatapoint
                                        isDeleted={isDeleted}
                                        recoverFunc={() => {
                                            if (isDeleted) {
                                                const original = draftSurveyOriginalCopy.dataPoints.find(d => d.draftId == dp.draftId);
                                                if (original) {
                                                    setDraftSurveyEditCopy((current) => {
                                                        if (current) {
                                                            const currentCopy = {...current};
                                                            currentCopy.dataPoints = currentCopy?.dataPoints ? [...currentCopy.dataPoints, {...original}] : [{...original}];
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
                                                        const currentCopy = {...current};
                                                        currentCopy.dataPoints = currentCopy?.dataPoints ? [...currentCopy.dataPoints].filter(d => d.draftId != dp.draftId) : [];
                                                        currentCopy.questionCount--;
                                                        return currentCopy
                                                    }
                                                })
                                            }
                                        }} datapoint={dp} key={dp.draftId}/>
                                })
                            }
                            <Group>
                                <Button onClick={openAddTextQuestionModal} type={"button"}>
                                    Add Text Question
                                </Button>
                                <Button onClick={openAddSelectQuestionModal} type={"button"}>
                                    Add Select Question
                                </Button>
                            </Group>

                            <Modal opened={isAddTextQuestionModalOpen} onClose={closeAddTextQuestionModal}>
                                <AddTextDataPoint saveFn={(label) => {
                                        const currentDraftSurvey = draftSurveyEditCopy!;
                                        if (currentDraftSurvey) {
                                            const newDp = NewDraftTextDataPoint(label, currentDraftSurvey.draftId, currentDraftSurvey?.dataPoints?.length || 0);
                                            addDataPointToDraftSurvey(newDp);
                                        }

                                }} closeFn={closeAddTextQuestionModal}/>
                            </Modal>
                            <Modal opened={isAddSelectQuestionModalOpen} onClose={closeAddSelectQuestionModal}>
                                <AddSelectDataPoint saveFn={(label, allowedValues) => {
                                        const currentDraftSurvey = draftSurveyEditCopy!;

                                        if (currentDraftSurvey) {
                                            const newDp = NewDraftSelectDatapoint(label, allowedValues, currentDraftSurvey.draftId, currentDraftSurvey?.dataPoints?.length || 0);
                                            addDataPointToDraftSurvey(newDp);
                                        }

                                }} closeFn={closeAddSelectQuestionModal}/>
                            </Modal>
                            <Group justify={"start"}>
                                <Button size="lg" type="button" loading={submitLoading} onClick={submitDraft}
                                        loaderProps={{type: "bars"}}>Submit</Button>
                                <Button size="lg" type="button" loading={submitLoading} onClick={saveAsDraft}
                                        loaderProps={{type: "bars"}}>Save as Draft</Button>
                            </Group>
                        </Stack>
                    </form>
                }
            </Card>
        </Stack>
    </Container>
}

function RenderTextDatapoint({datapoint}: {
    datapoint: {
        label: string
    },
}) {
    return <TextInput label={datapoint.label}>
    </TextInput>
}

function RenderSelectDatapoint({datapoint}: {
    datapoint: {
        label: string,
        allowedValues: string[]
    }
}) {
    return <Select
        label={datapoint.label}
        data={datapoint.allowedValues}
    ></Select>
}


function RenderDraftDatapoint({datapoint, deleteFunc, recoverFunc, isDeleted}: {
    datapoint: DraftDataPoint,
    deleteFunc: () => void,
    recoverFunc: () => void,
    isDeleted: boolean
}) {

    const DataPoint = useCallback(() => {
        if (datapoint.type == "text") {
            return <RenderTextDatapoint datapoint={datapoint}/>
        }
        if (datapoint.type == "select") {
            return <RenderSelectDatapoint datapoint={datapoint}/>
        }
        return null;
    }, [datapoint, deleteFunc])
    return <Group>
        <DataPoint/>
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
    </Group>
}

function AddTextDataPoint({saveFn, closeFn}: {
    saveFn: (label: string) => void,
    closeFn?: () => void
}) {

    const [label, setLabel] = useState("")

    return <Container fluid px={"lg"} py={"md"}>
        <form onSubmit={(e) => {
            e.preventDefault();
            saveFn(label);
            closeFn && closeFn()
        }}>
            <Stack gap={"md"}>
                <TextInput label={"Enter question"} value={label} onChange={(e) => {
                    setLabel(e.target.value)
                }}/>
                <Button type={"submit"}>
                    Submit
                </Button>
            </Stack>
        </form>
    </Container>
}

function AddSelectDataPoint({saveFn, closeFn}: {
    saveFn: (label: string, allowedValues: string[]) => void,
    closeFn?: () => void
}) {
    const [label, setLabel] = useState("");
    const [allowedValues, setAllowedValues] = useState([] as string[]);

    return <Container fluid px={"lg"} py={"md"}>
        <form onSubmit={(e) => {
            e.preventDefault();
            saveFn(label, allowedValues)
            closeFn && closeFn()
        }}>
            <Stack gap={"md"}>
                <TextInput label={"Enter question"} value={label} onChange={(e) => {
                    setLabel(e.target.value)
                }}/>
                {
                    allowedValues.map((allowedValue, idx) => {
                        return <Group key={idx}>
                            <TextInput label={"Allowed value for select"} value={allowedValue} onChange={(e) => {
                                const copy = [...allowedValues];
                                copy[idx] = e.target.value;
                                setAllowedValues(copy)
                            }}></TextInput>
                            <Button type={"button"} onClick={() => {
                                setAllowedValues(allowedValues.filter((_, i) =>
                                    i != idx
                                ))
                            }}>
                                Remove value
                            </Button>
                        </Group>
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
            </Stack>
        </form>
    </Container>
}