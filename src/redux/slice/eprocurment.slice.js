import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchCMSByType, UpdateEprocurmentRecordCMS } from '../../apis/cms.api';
import { toast_popup } from '../../utils/toast';

const initialState = {
  records: [],
  loading: false
}

const fetchProcurmentRecords = createAsyncThunk(
  'services/fetchProcurmentRecords',
  async (state, action) => {
    try {
      var response = await FetchCMSByType('eprocurment_records');
      var result = response.data;
      console.log({result});

      if(!result.success) {
        throw new Error(result.message || 'Something went wrong!');
      }
      return result?.result || [];
    }
    catch(err) {
      throw new Error(err?.response?.data?.message || err.message)
    }
  }
)

const updateProcurmentRecord = createAsyncThunk(
  'services/updateProcurmentRecord',
  async (state, action) => {
    try {
      var response = await UpdateEprocurmentRecordCMS(state);
      var result = response.data;

      if(!result.success) {
        throw new Error(result.message || 'Something went wrong!');
      }
      return result.result;
    }
    catch(err) {
      throw new Error(err?.response?.data?.message || err.message)
    }
  }
)

export const eprocurmentSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
  },
  extraReducers: {
    [fetchProcurmentRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchProcurmentRecords.fulfilled]: (state, action) => {
    state.records = action.payload.map(p => ({...p, _id: p._id, key: p._id}));
    state.loading = false;
    },
    [fetchProcurmentRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateProcurmentRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateProcurmentRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('Submitted Successfully', 'success')
    },
    [updateProcurmentRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchProcurmentRecords, updateProcurmentRecord };

export default eprocurmentSlice.reducer