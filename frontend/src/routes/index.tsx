import { createFileRoute, Link } from "@tanstack/react-router";
import {
    Button,
    Card,
    Center,
    Container, EmptyState,
    Flex,
    Group, Loader,
    Paper,
    SimpleGrid,
    Stack, Table,
    Text,
    Title
} from "@mantine/core";
import {MagnifyingGlassIcon, PencilLineIcon} from "@phosphor-icons/react";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {fetchSurveys, LoadingState} from "../slices/surveysSlice.ts";
import {useEffect} from "react";

export const Route = createFileRoute("/")({ component: Index })

function Index() {
    const dispatch = useAppDispatch();
    const {status,data} = useAppSelector((state)=>state.surveys)
    const isLoading = status == LoadingState.IDLE || status == LoadingState.LOADING;

    useEffect(()=>{
        if(status != LoadingState.IDLE) return;
        dispatch(fetchSurveys())
    },[dispatch,status])

    const surveys =
        data ?
            data.map(d => {
                return {
                    surveyId: d.id,
                    surveyName: d.name,
                    status: 'Active',
                    questions: d.questionCount,
                    responses: 100,
                    closes: new Date(),
                    owner: 'BALEN SHAH',
                    lastEdited: new Date(),
                }
            })
            : [];
    return <Container fluid px={"lg"} py={"md"}>
        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <Title order={1}>Surveys</Title>
                </Stack>
                <Stack gap={"md"}>
                    <Link to={"/survey/create"}>
                        <Button>
                            New Survey
                        </Button>
                    </Link>
                </Stack>
            </Flex>
            <SimpleGrid cols={5} spacing={"md"}>
                <StatCard title={"Active Surveys"} value={"12"} subTitle={{ value: "+2 this week", type: "increase" }} />
                <StatCard title={"Responses"} value={"18204"} subTitle={{ value: "+11%", type: "increase" }} />
                <StatCard title={"Avg Completion"} value={"71%"} subTitle={{ value: "-3 pts", type: "decrease" }} />
                <StatCard title={"Median Time"} value={"4m 12s"} subTitle={null} />
                <StatCard title={"Drafts"} value={"9"} subTitle={null} />
            </SimpleGrid>
            <Card shadow="lg" p="xs" radius="md" withBorder >
                <Table striped highlightOnHover stickyHeader={true}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                Survey
                            </Table.Th>
                            <Table.Th>
                                Status
                            </Table.Th>
                            <Table.Th>
                                Questions
                            </Table.Th>
                            <Table.Th>
                                Responses
                            </Table.Th>
                            <Table.Th>
                                Closes
                            </Table.Th>
                            <Table.Th>
                                Owner
                            </Table.Th>
                            <Table.Th>
                                Last edited
                            </Table.Th>
                            <Table.Th>

                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {
                            isLoading &&
                            <Table.Tr>
                                <Table.Td colSpan={7} rowSpan={10}>
                                    <Center>
                                        <Loader size={30} />
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        }
                        {
                            !isLoading && surveys.length === 0 && <Table.Tr>
                                <Table.Td colSpan={7} rowSpan={10}>
                                    <Center>
                                        <EmptyState
                                            icon={<MagnifyingGlassIcon />}
                                            title="No results found"
                                            description="We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results."
                                        />
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        }
                        {
                            surveys.map(s => <TableRow key={s.surveyName} {...s} />)
                        }
                    </Table.Tbody>
                </Table>
            </Card>

        </Stack>
    </Container>
}

function TableRow({
    surveyId,
    surveyName,
    status,
    questions,
    responses,
    closes,
    owner,
    lastEdited
}: {
    surveyId: string,
    surveyName: string,
    status: string,
    questions: number,
    responses: number,
    closes: Date,
    owner: string,
    lastEdited: Date
}) {
    return <Table.Tr>
        <Table.Td>
            {surveyName}
        </Table.Td>
        <Table.Td>
            {status}
        </Table.Td>
        <Table.Td>
            {questions}
        </Table.Td>
        <Table.Td>
            {responses}
        </Table.Td>
        <Table.Td>
            {closes.toLocaleDateString()}
        </Table.Td>
        <Table.Td>
            {owner}
        </Table.Td>
        <Table.Td>
            {lastEdited.toLocaleDateString()}
        </Table.Td>
        <Table.Td>
            <Link to={"/survey/edit/$surveyId"} params={{
                surveyId
            }}>
                <Button>
                    <PencilLineIcon size={20}/>
                </Button>
            </Link>
        </Table.Td>
    </Table.Tr>
}


function StatCard({
    title, value, subTitle
}: {
    title: string,
    value: string,
    subTitle: {
        value: string,
        type: "increase" | "decrease"
    } | null
}) {
    return <Paper withBorder px={20} pt={15} pb={10}>
        <Stack gap={"sm"}>
            <Text size={"sm"} c={"gray"} tt={"uppercase"} fw={700}>
                {title}
            </Text>
            <Group align={"end"}>
                <Text size={"xl"} lh={1} fw={700}>{value}</Text>
                {
                    subTitle &&
                    <Text size={"sm"} lh={1} c={subTitle.type == "increase" ? "green" : "red"}
                        fw={600}>{subTitle.value}</Text>
                }
            </Group>
        </Stack>
    </Paper>
}