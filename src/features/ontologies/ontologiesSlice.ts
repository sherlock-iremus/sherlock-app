import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState, AppThunk } from '../../app/store'
import { Ontology } from '../../model/Ontology'
import { CIDOC_CRM_ONTOLOGY } from '../../data/ontologies/CIDOC-CRM'

interface OntologiesState {
  ontologies: Map<string, Ontology>
}

const initialState: OntologiesState = {
  ontologies: new Map<string, Ontology>([
    [CIDOC_CRM_ONTOLOGY.name, CIDOC_CRM_ONTOLOGY]
  ])
}

export const ontologiesSlice = createSlice({
  name: 'ontologies',
  initialState,
  reducers: {
  }
})

export default ontologiesSlice.reducer