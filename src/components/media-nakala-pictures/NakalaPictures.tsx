import { useNakalaFiles } from "@/hooks/api"
import { Tabs } from "@heroui/react";
import OSD from "./OSD";

function makeNakalaIIIFURL(nakalaDOI: string, fileSHA1: string) {
    return `https://api.nakala.fr/iiif/${nakalaDOI}/${fileSHA1}/info.json`
}

export default function NakalaPictures({ nakalaE42 }: { nakalaE42: string }) {
    const parts = nakalaE42.split('/')
    const nakalaDOI = [parts.at(-2), parts.at(-1)].join('/')
    const { data } = useNakalaFiles(nakalaDOI)
    return data
        ? <Tabs className="w-full">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                    {data.map((file: any, index: number) => (
                        <Tabs.Tab id={file.sha1} key={file.sha1}>
                            {index + 1}
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
            {data.map((file: any) => (
                <Tabs.Panel key={file.sha1} id={file.sha1} className="w-full">
                    <OSD uri={makeNakalaIIIFURL(nakalaDOI, file.sha1)} />
                </Tabs.Panel>
            ))}

        </Tabs>
        : ''
}