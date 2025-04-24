"use client"
import { useHotkeys } from 'react-hotkeys-hook'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const HotKeyProvider = () => {
    const pagelist = ["/", "/Lessons","QuickReference", "/SheetMusicTools", "/Community"];
    const [page, setPage] = useState(0);
    const router = useRouter();
    useHotkeys('ctrl+arrowleft', () => { 
        if(page <= 0){
            setPage(4);
            router.push(pagelist[page]) 
        }
        else{
            setPage(page - 1);
            router.push(pagelist[page]) 
        }
    })
    useHotkeys('ctrl+arrowright', () => { 
        if(page >= 4){
            setPage(0);
            router.push(pagelist[page]) 
        }
        else{
            setPage(page + 1);
            router.push(pagelist[page]) 
        }
    })
    return (
        <>
        </>
    )
}
export default HotKeyProvider