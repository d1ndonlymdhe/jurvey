import {createFileRoute} from '@tanstack/react-router'
import {useAddDataPoint, useSurvey} from "../../queryHooks/useSurvey.ts";
import {useState} from "react";
import {Button, Card, Container, Flex, Stack, TextInput, Text, Title, Modal} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

export const Route = createFileRoute('/survey/edit/$surveyId')({
    component: RouteComponent,
})

function RouteComponent() {
    const {surveyId} = Route.useParams();
    const {data: survey, isLoading: surveyLoading} = useSurvey(surveyId);
    const [isAddQuestionModalOpen, {open: openAddQuestionModal, close: closeAddQuestionModal}] = useDisclosure(false)

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
    const {data: survey, isLoading: surveyLoading} = useSurvey(surveyId);
    const {mutate: addDataPoint} = useAddDataPoint(surveyId);

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
            addDataPoint({
                    label: label
                },
                {
                    onSettled: () => {
                        closeFn && closeFn()
                    }
                }
            )
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
