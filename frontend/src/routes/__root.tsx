import {createRootRoute, Link, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {ActionIcon, AppShell, Avatar, Flex, Group, ThemeIcon, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import '@mantine/spotlight/styles.css';
import {BellIcon} from "@phosphor-icons/react";


const RootLayout = () => {
    const [opened] = useDisclosure();
    return <>
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Flex direction={"row"} align={"center"} justify={"space-between"} py={10} px={10}>
                    <Group>
                        <ThemeIcon size={30}>
                            J
                        </ThemeIcon>
                        <Title order={3}>Jurvey</Title>
                    </Group>
                    <Group>
                        <ActionIcon size={42} variant="default" aria-label="ActionIcon with size as a number">
                            <BellIcon></BellIcon>
                        </ActionIcon>
                        <Avatar radius="xl" />
                    </Group>
                </Flex>
            </AppShell.Header>
            <AppShell.Aside>
                <AppShell.Navbar>
                    <div className="p-2 flex gap-2">
                        <Link to="/" className="[&.active]:font-bold">
                            Home
                        </Link>{' '}
                        <Link to="/about" className="[&.active]:font-bold">
                            About
                        </Link>
                    </div>
                </AppShell.Navbar>
            </AppShell.Aside>
            <AppShell.Main bg={"gray.0"}>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
        <TanStackRouterDevtools/>
    </>
}

export const Route = createRootRoute({component: RootLayout})