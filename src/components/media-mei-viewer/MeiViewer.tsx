import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';
import { useEffect, useRef, useState } from "react";
import { Button } from '@heroui/react';
import { GrNext, GrPrevious, GrZoomIn, GrZoomOut } from "react-icons/gr";

export default function ({ meiUri: meiUri }: { meiUri: string }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [toolkit, setToolkit] = useState(null);
    const [scale, setScale] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const reloadVerovio = () => {
        if (!toolkit) return;
        // @ts-ignore
        toolkit.setOptions({ scale })
        // @ts-ignore
        const svg = toolkit.renderToSVG(currentPage);
        if (containerRef.current) {
            containerRef.current.innerHTML = svg;
        }
    }

    useEffect(() => {
        async function initAndRender() {
            const VerovioModule = await createVerovioModule();
            const vtk = new VerovioToolkit(VerovioModule);
            const response = await fetch(meiUri);


            // Detect encoding
            const buffer = await response.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let decoder: TextDecoder;
            if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
                // UTF-16 BE
                decoder = new TextDecoder("utf-16be");
            } else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
                // UTF-16 LE
                decoder = new TextDecoder("utf-16le");
            } else if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
                // UTF-8 with BOM
                decoder = new TextDecoder("utf-8");
            } else {
                // fallback: assume UTF-8 without BOM
                decoder = new TextDecoder("utf-8");
            }

            const score = decoder.decode(buffer);
            vtk.loadData(score);
            vtk.setOptions({
                scale,
                adjustPageWidth: false,
                adjustPageHeight: true,
                // header: 'none',
                // footer: 'none',
            })
            setPageCount(vtk.getPageCount())
            setToolkit(vtk)
            reloadVerovio();
        }

        if (meiUri) {
            initAndRender()
        }
    }, [meiUri])

    reloadVerovio()

    return <div className='flex-col border w-full'>
        <div className='flex justify-center items-center gap-2 p-2 border-b'>
            <Button onPress={() => { setCurrentPage(currentPage - 1) }} variant='outline' isDisabled={currentPage === 1}><GrPrevious /></Button>
            <div className='text-sm'>{currentPage}/{pageCount}</div>
            <Button onPress={() => { setCurrentPage(currentPage + 1) }} variant='outline' isDisabled={currentPage === pageCount}><GrNext /></Button>
            <Button onPress={() => { setScale(scale + 2) }} variant='outline'><GrZoomIn /></Button>
            <Button onPress={() => { setScale(scale - 2) }} variant='outline'><GrZoomOut /></Button>
        </div>
        <div className='flex justify-center w-full' ref={containerRef} />
    </div>;
}