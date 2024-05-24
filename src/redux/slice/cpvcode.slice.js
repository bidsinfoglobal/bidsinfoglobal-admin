import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchCPVCode, insertCPVCode, updateCPVCode, deleteCPVCode } from '../../apis/master/cpvcode.api';

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

const changeCPVParameter = createAsyncThunk(
  'cpvcode/changeCPVParameter',
  async (state, action) => {
    return state;
  }
)

const fetchCPVRecords = createAsyncThunk(
  'cpvcode/fetchCPVRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchCPVCode(state);
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

const insertCPVRecord = createAsyncThunk(
  'cpvcode/insertCPVRecord',
  async (state, action) => {
    try {
      var response = await insertCPVCode(state);
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

const updateCPVRecord = createAsyncThunk(
  'cpvcode/updateCPVRecord',
  async (state, action) => {
    try {
      var response = await updateCPVCode(state);
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

const deleteCPVRecord = createAsyncThunk(
  'cpvcode/deleteCPVRecord',
  async (state, action) => {
    try {
      var response = await deleteCPVCode(state.id);
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

export const cpvSlice = createSlice({
  name: 'cpvcode',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeCPVParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeCPVParameter.fulfilled]: (state, action) => {
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
    [changeCPVParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchCPVRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCPVRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords;
      state.count = Number(action.payload.count);
    },
    [fetchCPVRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertCPVRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertCPVRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('cpv code created successfully', 'success');
    },
    [insertCPVRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateCPVRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCPVRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('cpv code updated successfully', 'success');
    },
    [updateCPVRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteCPVRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCPVRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('cpv code deleted successfully', 'success');
    },
    [deleteCPVRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchCPVRecords, updateCPVRecord, insertCPVRecord, deleteCPVRecord, changeCPVParameter };

export default cpvSlice.reducer