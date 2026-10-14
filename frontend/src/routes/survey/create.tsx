import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import { Container, Flex, Stack, Title, Card, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {useAppDispatch} from "../../hooks.ts";
import {createSurvey} from "../../slices/surveysSlice.ts";

export const Route = createFileRoute('/survey/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    const navigate = useNavigate();
    const [submitLoading, { open: openSubmitLoading, close: closeSubmitLoading }] = useDisclosure();
    const dispatch = useAppDispatch()
    return <Container fluid px={"lg"} py={"md"}>
        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <Title order={1}>Create Survey</Title>
                </Stack>
            </Flex>
            <Card w="60%" shadow="lg" p="xs" radius="md" withBorder>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    openSubmitLoading();

                    dispatch(createSurvey({
                        name,description,title
                    })).unwrap().then(r=>{
                        navigate({ to: `/survey/edit/$surveyId`, params: { surveyId: r.id } })
                    }).finally(()=>{
                        closeSubmitLoading();

                    })
                }}>
                    <Stack gap={"md"}>
                        <TextInput label="Survey Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <TextInput label="Survey Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <Textarea label="Survey Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Group justify={"start"}>
                            <Button size="lg" type="submit" loading={submitLoading} loaderProps={{ type: "bars" }}>Submit</Button>
                        </Group>
                    </Stack>
                </form>
            </Card>
        </Stack>
    </Container>
}
