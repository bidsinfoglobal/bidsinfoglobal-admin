import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchTenders, insertTender, updateTender, deleteTender } from '../../apis/tender.api';

const initialState = {
  records: [],
  loading: false,
  pageNo: 0,
  count: 0,
  keywords: '',
  limit: 5,
  sortBy: -1,
  sortField: '_id'
}

const changeTenderParameter = createAsyncThunk(
  'tender/changeTenderParameter',
  async (state, action) => {
    return state;
  }
)

const fetchTenderRecords = createAsyncThunk(
  'tender/fetchTenderRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchTenders(state);
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

const insertTenderRecord = createAsyncThunk(
  'tender/insertTenderRecord',
  async (state, action) => {
    try {
      var response = await insertTender(state);
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

const updateTenderRecord = createAsyncThunk(
  'tender/updateTenderRecord',
  async (state, action) => {
    try {
      var response = await updateTender(state);
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

const deleteTenderRecord = createAsyncThunk(
  'tender/deleteTenderRecord',
  async (state, action) => {
    try {
      var response = await deleteTender(state.id);
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

export const TenderSlice = createSlice({
  name: 'tender',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeTenderParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeTenderParameter.fulfilled]: (state, action) => {
    const { pageNo, limit, sortBy, sortField, keywords, count, records } = action.payload;
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
    
    if(records && Array.isArray(records))
    state.records = records;
    
    },
    [changeTenderParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchTenderRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchTenderRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords || '';
      state.count = Number(action.payload.count);
      
      state.query = JSON.stringify(action.payload.query);
    },
    [fetchTenderRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertTenderRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertTenderRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('tender created successfully', 'success');
    },
    [insertTenderRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateTenderRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTenderRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('tender updated successfully', 'success');
    },
    [updateTenderRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteTenderRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteTenderRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('tender deleted successfully', 'success');
    },
    [deleteTenderRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchTenderRecords, updateTenderRecord, insertTenderRecord, deleteTenderRecord, changeTenderParameter };

export default TenderSlice.reducer