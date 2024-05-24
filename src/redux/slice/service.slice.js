import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchCMSByType, UpdateServiceRecordData } from '../../apis/cms.api';
import { toast_popup } from '../../utils/toast';

const initialState = {
  records: [],
  loading: false
}

const fetchServiceRecords = createAsyncThunk(
  'services/fetchServiceRecords',
  async (state, action) => {
    try {
      var response = await FetchCMSByType('service_records');
      var result = response.data;

      if(!result.success && result.result) {
        throw new Error(result.message || 'Something went wrong!');
      }
      return result.result;
    }
    catch(err) {
      throw new Error(err?.response?.data?.message || err.message)
    }
  }
)

const updateServiceRecord = createAsyncThunk(
  'services/updateServiceRecord',
  async (state, action) => {
    try {
      var response = await UpdateServiceRecordData(state);
      var result = response.data;

      if(!result.success && result.result) {
        throw new Error(result.message || 'Something went wrong!');
      }
      return result.result;
    }
    catch(err) {
      throw new Error(err?.response?.data?.message || err.message)
    }
  }
)

export const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
  },
  extraReducers: {
    [fetchServiceRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchServiceRecords.fulfilled]: (state, action) => {
    state.records = action.payload.map(p => ({...p, _id: p._id, key: p._id}));
    state.loading = false;
    },
    [fetchServiceRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateServiceRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateServiceRecord.fulfilled]: (state, action) => {
      state.loading = false;
      
    },
    [updateServiceRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchServiceRecords, updateServiceRecord };

export default serviceSlice.reducer