import { Location } from 'react-router-dom'
import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

export interface ProjectIdData {
    code?: string,
    emoticon?: string,
    logo?: string,
    name?: string,
    uuid?: string,
}

export function extractProjectData(data_project?: SparqlQueryResultObject): ProjectIdData {
    const x: ProjectIdData = {
        code: '',
        emoticon: '',
        logo: '',
        name: '',
        uuid: ''
    }
    if (data_project?.results.bindings.length === 0) return x
    x.code = data_project?.results.bindings[0]['project_code']['value']
    x.emoticon = data_project?.results.bindings[0]['project_emoticon']['value']
    x.logo = data_project?.results.bindings[0]['project_logo']['value']
    x.name = data_project?.results.bindings[0]['project_name']['value']
    x.uuid = data_project?.results.bindings[0]['project_uuid']['value']
    return x
}

export function getProjecCodeFromLocation(location: Location): string {
    const pathnameParts = location.pathname.split('/').filter(_ => _)
    return pathnameParts[0] == 'projects' ? pathnameParts[1] : ''
}