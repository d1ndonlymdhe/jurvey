import {createFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from "react";
import {Button, Card, Container, Flex, Stack, TextInput, Text, Title, Modal} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {BackButton} from "../../components/BackButton.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {LoadingState} from "../../slices/surveysSlice.ts";
import {createTextDatapoint, fetchDetailedSurvey} from "../../slices/detailedSurveySlice.ts";

export const Route = createFileRoute('/survey/edit/$surveyId')({
    component: RouteComponent,
})


function useSurvey(surveyId: string){
    const allItems = useAppSelector(store=>store.detailedSurvey);
    const item = allItems.items.find(i=>i.surveyId == surveyId)
    const dispatch = useAppDispatch();
    useEffect(()=>{
        if (!item || item.status == "IDLE"){
            dispatch(fetchDetailedSurvey(surveyId))
        }
    },[surveyId,dispatch])
    if(!item){
        return {
            surveyId: surveyId,
            status: LoadingState.IDLE,
            errorMsg: null,
            data: null
        }
    }else{
        return item
    }
}

function RouteComponent() {
    const {surveyId} = Route.useParams();
    const {data:survey,status} = useSurvey(surveyId);
    const [isAddQuestionModalOpen, {open: openAddQuestionModal, close: closeAddQuestionModal}] = useDisclosure(false)
    const surveyLoading = status == LoadingState.LOADING || status == LoadingState.IDLE;
    if (surveyLoading) {
        return <div>Loading</div>
    }

    if (!survey) {
        return <div>Survey Not Found</div>
    }

    return <Container fluid px={"lg"} py={"md"}>
        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <BackButton></BackButton>
                    <Title order={1}>Edit Survey: {survey.name}</Title>
                </Stack>
            </Flex>
            <Card w="60%" shadow="lg" p="xs" radius="md" withBorder>
                <Stack gap={"md"}>
                    <Title order={2}> {survey.title}</Title>
                    <Text>
                        {survey.description}
                    </Text>
                    {
                        survey.dataPoints.map((dp) => {
                            return <TextInput label={dp.label}/>
                        })
                    }
                    <Button onClick={() => {
                        openAddQuestionModal()
                    }}>
                        Add question
                    </Button>
                </Stack>
            </Card>
        </Stack>
        <Modal opened={isAddQuestionModalOpen} onClose={closeAddQuestionModal}>
            <AddTextDataPoint surveyId={surveyId} closeFn={closeAddQuestionModal}/>
        </Modal>
    </Container>
}

function AddTextDataPoint({surveyId, closeFn}: { surveyId: string, closeFn?: () => void }) {
    const {data:survey,status} = useSurvey(surveyId);
    const surveyLoading = status == LoadingState.LOADING || status == LoadingState.IDLE;
    const dispatch = useAppDispatch();
    // const {mutate: addDataPoint} = useAddDataPoint(surveyId);

    const [label, setLabel] = useState("")

    if (surveyLoading) {
        return "Loading"
    }

    if (!survey) {
        return "Survey Not Found"
    }

    return <Container fluid px={"lg"} py={"md"}>
        <form onSubmit={(e) => {
            e.preventDefault();
            dispatch(createTextDatapoint({
                surveyId: surveyId,
                label: label
            })).unwrap().then(_r=>{
                closeFn && closeFn()
            })

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
