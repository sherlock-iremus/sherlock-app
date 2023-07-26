import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState, AppThunk } from '../../app/store'
import { Resource } from '../../model/Resource'

interface ResourcesState {
  primaryEditedResource: Resource,
  secondaryEditedResource: Resource
}

const initialState: ResourcesState = {
  primaryEditedResource: new Resource(),
  secondaryEditedResource: new Resource()
}

export const resourcesSlice = createSlice({
  name: 'ontologies',
  initialState,
  reducers: {
  }
})

export default resourcesSlice.reducer