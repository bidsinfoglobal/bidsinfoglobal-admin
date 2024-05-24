import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchRegion, insertRegion, updateRegion, deleteRegion } from '../../apis/master/region.api';

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

const changeRegionParameter = createAsyncThunk(
  'region/changeRegionParameter',
  async (state, action) => {
    return state;
  }
)

const fetchRegionRecords = createAsyncThunk(
  'region/fetchRegionRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchRegion(state);
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

const insertRegionRecord = createAsyncThunk(
  'region/insertRegionRecord',
  async (state, action) => {
    try {
      var response = await insertRegion(state);
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

const updateRegionRecord = createAsyncThunk(
  'region/updateRegionRecord',
  async (state, action) => {
    try {
      var response = await updateRegion(state);
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

const deleteRegionRecord = createAsyncThunk(
  'region/deleteRegionRecord',
  async (state, action) => {
    try {
      var response = await deleteRegion(state.id);
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

export const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeRegionParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeRegionParameter.fulfilled]: (state, action) => {
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
    [changeRegionParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchRegionRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchRegionRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords;
      state.count = Number(action.payload.count);
    },
    [fetchRegionRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertRegionRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertRegionRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('region created successfully', 'success');
    },
    [insertRegionRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateRegionRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateRegionRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('region updated successfully', 'success');
    },
    [updateRegionRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteRegionRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteRegionRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('region deleted successfully', 'success');
    },
    [deleteRegionRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchRegionRecords, updateRegionRecord, insertRegionRecord, deleteRegionRecord, changeRegionParameter };

export default regionSlice.reducer