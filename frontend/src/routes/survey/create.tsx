import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import { useCreateSurvey } from "../../queryHooks/useSurvey.ts";
import { Container, Flex, Stack, Title, Card, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export const Route = createFileRoute('/survey/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const { mutate: createSurvey } = useCreateSurvey();
    const navigate = useNavigate();
    const [submitLoading, { toggle: toggleSubmitLoading }] = useDisclosure();
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
                    toggleSubmitLoading();
                    createSurvey({ name, description, title }, {
                        onSuccess: (data) => {
                            navigate({ to: `/survey/edit/$surveyId`, params: { surveyId: data.id } })
                        },
                        onSettled: () => {
                            toggleSubmitLoading();
                        }
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
