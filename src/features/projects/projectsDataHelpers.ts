import { SparqlQueryResultObject } from 'sherlock-rdf/lib/sparql-result'

export interface ProjectData {
    code?: string,
    logo?: string,
    name?: string,
    uuid?: string,
}

export function extractProjectData(data_project?: SparqlQueryResultObject): ProjectData {
    const x: ProjectData = {
        code: '',
        logo: '',
        name: '',
        uuid: ''
    }
    if (data_project?.results.bindings.length === 0) return x
    x.code = data_project?.results.bindings[0]['project_code']['value']
    x.logo = data_project?.results.bindings[0]['project_logo']['value']
    x.name = data_project?.results.bindings[0]['project_name']['value']
    x.uuid = data_project?.results.bindings[0]['project_uuid']['value']
    return x
}
