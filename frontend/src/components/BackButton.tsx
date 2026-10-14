import { useRouter, useCanGoBack } from '@tanstack/react-router'
import {NavLink} from "@mantine/core";
import {ArrowLeftIcon} from "@phosphor-icons/react";

export function BackButton() {
    const router = useRouter()
    const canGoBack = useCanGoBack()

    return (
        <>
            {canGoBack ? (
                <NavLink
                    onClick={()=>router.history.back()}
                    label={"Go back"}
                    leftSection={<ArrowLeftIcon/>}
                />
            ) : null}
        </>
    )
}
