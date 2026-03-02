import { useQuery } from '@tanstack/react-query'

export function useNakalaFiles(nakalaE42: string) {
    return useQuery({
        queryKey: ['nakala-files', nakalaE42],
        queryFn: async () => {
            const response = await fetch(`https://api.nakala.fr/datas/${nakalaE42}/files`)
            return await response.json()
        },
    })
}