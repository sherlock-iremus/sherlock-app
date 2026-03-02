import { useLayoutEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";

export default function ({ uri }: { uri: string }) {
    const viewerRef = useRef<HTMLDivElement | null>(null);
    const osdInstance = useRef<OpenSeadragon.Viewer | null>(null);

    useLayoutEffect(() => {
        if (!viewerRef.current) return;

        const viewer = OpenSeadragon({
            element: viewerRef.current,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: uri,
        });

        viewer.forceRedraw();

        osdInstance.current = viewer;

        viewer.addHandler("open", () => {
            viewer.forceRedraw();
        });

        return () => {
            viewer.destroy();
        };
    }, [uri]);

    return (
        <div
            ref={viewerRef}
            className="bg-black w-full"
            style={{ height: "600px" }}
        />
    );
}