import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useCallback, useState} from "react";
import {Container, Flex, Stack, Title, Card, TextInput, Textarea, Button, Group, Modal, Select} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {LoadingState} from "../../slices/surveysSlice.ts";
import {
    createDraftSurvey, createFromDraft, DraftDataPoint,
    DraftSurvey, NewDraftSelectDatapoint,
    NewDraftSurvey,
    NewDraftTextDataPoint, selectDraftSurveyWithId
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
    const [draftSurvey, setDraftSurvey] = useState<DraftSurvey>(selectedDraft ? selectedDraft : NewDraftSurvey())

    const saveAsDraft = useCallback(() => {
        dispatch(createDraftSurvey(draftSurvey))
    }, [draftSurvey])
    const submitDraft = useCallback(() => {
        saveAsDraft();
        dispatch(createFromDraft(draftSurvey)).unwrap().then(res => {
            navigate({
                to: "/survey/edit/$surveyId", params: {
                    surveyId: res.id
                }
            }).then()
        })
    }, [draftSurvey])

    const submitLoading = draftSurvey.syncStatus == LoadingState.LOADING

    return <Container fluid px={"lg"} py={"md"}>
        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <Title order={1}>Create Survey</Title>
                </Stack>
            </Flex>
            <Card w="60%" shadow="lg" p="xs" radius="md" withBorder>
                {
                    draftSurvey &&
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <Stack gap={"md"}>
                            <TextInput label="Survey Name" value={draftSurvey.name} onChange={(e) => setDraftSurvey({
                                ...draftSurvey,
                                name: e.target.value
                            })}/>
                            <TextInput label="Survey Title" value={draftSurvey.title} onChange={(e) => setDraftSurvey({
                                ...draftSurvey,
                                title: e.target.value
                            })}/>
                            <Textarea label="Survey Description" value={draftSurvey.description}
                                      onChange={(e) => setDraftSurvey({
                                          ...draftSurvey,
                                          description: e.target.value
                                      })}/>
                            {
                                draftSurvey.dataPoints.map((dp) => {
                                    return <RenderDraftDatapoint datapoint={dp} key={dp.draftId}/>
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
                                    setDraftSurvey((currentDraftSurvey) => {
                                        currentDraftSurvey = currentDraftSurvey!;
                                        return {
                                            ...currentDraftSurvey,
                                            dataPoints: [...currentDraftSurvey?.dataPoints, NewDraftTextDataPoint(label, currentDraftSurvey.draftId)],
                                            questionCount: currentDraftSurvey.questionCount + 1
                                        }
                                    })
                                }} closeFn={closeAddTextQuestionModal}/>
                            </Modal>
                            <Modal opened={isAddSelectQuestionModalOpen} onClose={closeAddSelectQuestionModal}>
                                <AddSelectDataPoint saveFn={(label, allowedValues) => {
                                    setDraftSurvey((currentDraftSurvey) => {
                                        currentDraftSurvey = currentDraftSurvey!;
                                        return {
                                            ...currentDraftSurvey,
                                            dataPoints: [...currentDraftSurvey?.dataPoints, NewDraftSelectDatapoint(label, allowedValues, currentDraftSurvey.draftId)],
                                            questionCount: currentDraftSurvey.questionCount + 1
                                        }
                                    })
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
    }
}){
    return <TextInput label={datapoint.label}>
    </TextInput>
}

function RenderSelectDatapoint({datapoint}: {
    datapoint: {
        label: string,
        allowedValues: string[]
    }
}){
    return <Select
        label={datapoint.label}
        data={datapoint.allowedValues}
    ></Select>
}


function RenderDraftDatapoint({datapoint}: {
    datapoint: DraftDataPoint
}){
    if (datapoint.type == "text"){
        return <RenderTextDatapoint datapoint={datapoint}/>
    }
    if (datapoint.type == "select"){
        return <RenderSelectDatapoint datapoint={datapoint}/>
    }
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