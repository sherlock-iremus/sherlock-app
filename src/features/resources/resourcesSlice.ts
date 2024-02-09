// import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
// import { RootState, AppThunk } from '../../app/store'
import { Resource } from 'sherlock-rdf/lib/resource'

export interface ResourcesState {
  primaryEditedResource: Resource,
  secondaryEditedResource: Resource
}

const initialState: ResourcesState = {
  primaryEditedResource: new Resource(),
  secondaryEditedResource: new Resource()
}

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
  }
})

export default resourcesSlice.reducer