import {createRootRoute, Link, Outlet} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {AppShell} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";



const RootLayout = () => {
    const [opened] = useDisclosure();
    return <>
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                JURVEY
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
            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
        <TanStackRouterDevtools/>
    </>
}

export const Route = createRootRoute({component: RootLayout})