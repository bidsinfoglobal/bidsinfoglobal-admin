import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchFundingAgencies, insertFundingAgency, updateFundingAgency, deleteFundingAgency } from '../../apis/master/funding_agency';

const initialState = {
  records: [],
  loading: false,
  pageNo: 0,
  count: 0,
  keywords: '',
  limit: 5,
  sortBy: 1,
  sortField: '_id'
}

const changeFundingParameter = createAsyncThunk(
  'state/changeFundingParameter',
  async (state, action) => {
    return state;
  }
)

const fetchFundingRecords = createAsyncThunk(
  'state/fetchFundingRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchFundingAgencies(state);
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

const insertFundingRecord = createAsyncThunk(
  'state/insertFundingRecord',
  async (state, action) => {
    try {
      var response = await insertFundingAgency(state);
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

const updateFundingRecord = createAsyncThunk(
  'state/updateFundingRecord',
  async (state, action) => {
    try {
      var response = await updateFundingAgency(state);
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

const deleteFundingRecord = createAsyncThunk(
  'state/deleteFundingRecord',
  async (state, action) => {
    try {
      var response = await deleteFundingAgency(state.id);
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

export const sectorSlice = createSlice({
  name: 'funding',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeFundingParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeFundingParameter.fulfilled]: (state, action) => {
    const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
    if(pageNo || pageNo === 0)
      state.pageNo = pageNo;

    if(limit || limit === 0)
      state.limit = limit;

    if(sortBy) 
      state.sortBy = sortBy;

    if(sortField)
      state.sortField = sortField;
    
    if(keywords)
      state.keywords = keywords;
    
    if(count || count === 0)
      state.count = count;
    
    },
    [changeFundingParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchFundingRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchFundingRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords;
      state.count = Number(action.payload.count);
    },
    [fetchFundingRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertFundingRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertFundingRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('funding agency created successfully', 'success');
    },
    [insertFundingRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateFundingRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateFundingRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('funding agency updated successfully', 'success');
    },
    [updateFundingRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteFundingRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteFundingRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('funding agency deleted successfully', 'success');
    },
    [deleteFundingRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchFundingRecords, updateFundingRecord, insertFundingRecord, deleteFundingRecord, changeFundingParameter };

export default sectorSlice.reducer