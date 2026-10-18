import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useCallback, useState} from "react";
import {Container, Flex, Stack, Title, Card, TextInput, Textarea, Button, Group, Modal} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {LoadingState} from "../../slices/surveysSlice.ts";
import {

    createDraftSurvey, createFromDraft,
    DraftSurvey,
    NewDraftSurvey,
    NewDraftTextDataPoint, selectDraftSurveyWithId
} from "../../slices/draftSurveySlice.ts";


export const Route = createFileRoute('/survey/create/{-$draftId}')({
    component: RouteComponent,
})

function RouteComponent() {
    const {draftId} = Route.useParams();
    const navigate = useNavigate();

    const [isAddQuestionModalOpen, {open: openAddQuestionModal, close: closeAddQuestionModal}] = useDisclosure(false)
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
                                    return <TextInput label={dp.label}/>
                                })
                            }
                            <Button onClick={openAddQuestionModal} type={"button"}>
                                Add Datapoint
                            </Button>
                            <Modal opened={isAddQuestionModalOpen} onClose={closeAddQuestionModal}>
                                <AddTextDataPoint saveFn={(label) => {
                                    setDraftSurvey((currentDraftSurvey) => {
                                        currentDraftSurvey = currentDraftSurvey!;
                                        return {
                                            ...currentDraftSurvey,
                                            dataPoints: [...currentDraftSurvey?.dataPoints, NewDraftTextDataPoint(label, currentDraftSurvey.draftId)],
                                            questionCount: currentDraftSurvey.questionCount + 1
                                        }
                                    })
                                }} closeFn={closeAddQuestionModal}/>
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