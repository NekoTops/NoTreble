"use client"
import { useHotkeys } from 'react-hotkeys-hook'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const HotKeyProvider = () => {
    const router = useRouter();
    useHotkeys('ctrl+arrowup', () => { router.push("/") })
    useHotkeys('ctrl+arrowdown', () => { router.push("/Lessons") })
    useHotkeys('ctrl+arrowleft', () => { router.push("/SheetMusicTools") })
    useHotkeys("ctrl+arrowright", () => { router.push("/Community") })
    return (
        <>
        </>
    )
}
export default HotKeyProvider