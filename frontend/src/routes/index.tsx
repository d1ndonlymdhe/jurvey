import {createFileRoute, Link} from "@tanstack/react-router";
import {BasicSurveyResDTO} from "./api/data-contracts.ts";
import {
    Breadcrumbs,
    Button,
    Container,
    DataList,
    Flex,
    Group,
    Paper, Progress,
    SimpleGrid,
    Stack, Table,
    Text,
    Title
} from "@mantine/core";

export const Route = createFileRoute("/")({component: Index})

function Index() {
    const surveys = [
        { surveyName: 'Customer onboarding NPS (Q4)', status: 'Active',    questions: 14, responses: 1284, closes: new Date(2026, 9, 31),  owner: 'J. Moreau', lastEdited: new Date(2026, 9, 8, 10, 15) },
        { surveyName: 'Employee pulse (October)',     status: 'Active',    questions: 9,  responses: 412,  closes: new Date(2026, 9, 15),  owner: 'R. Okafor', lastEdited: new Date(2026, 9, 7) },
        { surveyName: 'Checkout friction study',      status: 'Active',    questions: 22, responses: 3907, closes: new Date(2026, 10, 12), owner: 'L. Chen',   lastEdited: new Date(2026, 9, 6) },
        { surveyName: 'Webinar feedback: Data 101',   status: 'Scheduled', questions: 6,  responses: 0,    closes: new Date(2026, 9, 20),  owner: 'J. Moreau', lastEdited: new Date(2026, 9, 5) },
        { surveyName: 'Pricing page concept test',    status: 'Draft',     questions: 18, responses: 0,    closes: new Date(2026, 10, 30), owner: 'A. Silva',  lastEdited: new Date(2026, 9, 5) },
        { surveyName: 'Support CSAT (rolling)',       status: 'Active',    questions: 3,  responses: 9560, closes: new Date(2026, 11, 31), owner: 'R. Okafor', lastEdited: new Date(2026, 9, 3) },
        { surveyName: 'Mobile app beta exit survey',  status: 'Closed',    questions: 11, responses: 736,  closes: new Date(2026, 8, 30),  owner: 'L. Chen',   lastEdited: new Date(2026, 8, 30) },
        { surveyName: 'Brand awareness tracker W3',   status: 'Closed',    questions: 27, responses: 2001, closes: new Date(2026, 8, 22),  owner: 'A. Silva',  lastEdited: new Date(2026, 8, 22) },
        { surveyName: 'Event registration form',      status: 'Draft',     questions: 8,  responses: 0,    closes: new Date(2026, 10, 15), owner: 'J. Moreau', lastEdited: new Date(2026, 8, 19) },
        { surveyName: 'Partner satisfaction 2026',    status: 'Active',    questions: 16, responses: 188,  closes: new Date(2026, 11, 1),  owner: 'R. Okafor', lastEdited: new Date(2026, 8, 18) },
        { surveyName: 'Feature request intake',       status: 'Active',    questions: 5,  responses: 1032, closes: new Date(2027, 2, 31),  owner: 'L. Chen',   lastEdited: new Date(2026, 8, 12) },
        { surveyName: 'Q3 churn interviews screener', status: 'Closed',    questions: 12, responses: 340,  closes: new Date(2026, 8, 5),   owner: 'A. Silva',  lastEdited: new Date(2026, 8, 5) },
    ];
    return <Container fluid px={"lg"} py={"md"}>
        <Stack gap={"md"}>
            <Flex direction={"row"} justify={"space-between"} align={"end"}>
                <Stack gap={"xs"}>
                    <Breadcrumbs>
                        <Text>Workspace</Text>
                        <Text>Surveys</Text>
                    </Breadcrumbs>
                    <Title order={1}>Surveys</Title>
                </Stack>
                <Stack gap={"md"}>
                    <Button>
                        New Survey
                    </Button>
                </Stack>
            </Flex>
            <SimpleGrid cols={5} spacing={"md"}>
                <StatCard title={"Active Surveys"} value={"12"} subTitle={{value:"+2 this week", type:"increase"}}/>
                <StatCard title={"Responses"} value={"18204"} subTitle={{value:"+11%", type:"increase"}}/>
                <StatCard title={"Avg Completion"} value={"71%"} subTitle={{value:"-3 pts", type:"decrease"}}/>
                <StatCard title={"Median Time"} value={"4m 12s"} subTitle={null}/>
                <StatCard title={"Drafts"} value={"9"} subTitle={null}/>
            </SimpleGrid>
            <Table stickyHeader={true}>
                <Table.Thead>
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
                </Table.Thead>
                <Table.Tbody>
                    {
                        surveys.map(s=><TableRow {...s}/>)
                    }
                </Table.Tbody>
            </Table>
        </Stack>
    </Container>
}

function TableRow({
    surveyName,
    status,
    questions,
    responses,
    closes,
    owner,
    lastEdited
                  }:{
    surveyName: string,
    status: string,
    questions: number,
    responses:number,
    closes: Date,
    owner: string,
    lastEdited: Date
}){
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
}){
    return  <Paper withBorder px={20} pt={15} pb={10}>
        <Stack gap={"sm"}>
            <Text size={"sm"} c={"gray"} tt={"uppercase"} fw={700}>
                {title}
            </Text>
            <Group align={"end"}>
                <Text size={"xl"} lh={1} fw={700}>{value}</Text>
                {
                    subTitle &&
                    <Text size={"sm"} lh={1} c={subTitle.type == "increase" ? "green" : "red"} fw={600}>{subTitle.value}</Text>
                }
            </Group>
        </Stack>
    </Paper>
}