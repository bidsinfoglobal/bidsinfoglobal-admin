import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchSector, insertSector, updateSector, deleteSector } from '../../apis/master/sector.api';

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

const changeSectorParameter = createAsyncThunk(
  'state/changeSectorParameter',
  async (state, action) => {
    return state;
  }
)

const fetchSectorRecords = createAsyncThunk(
  'state/fetchSectorRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchSector(state);
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

const insertSectorRecord = createAsyncThunk(
  'sector/insertSectorRecord',
  async (state, action) => {
    try {
      var response = await insertSector(state);
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

const updateSectorRecord = createAsyncThunk(
  'sector/updateSectorRecord',
  async (state, action) => {
    try {
      var response = await updateSector(state);
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

const deleteSectorRecord = createAsyncThunk(
  'sector/deleteSectorRecord',
  async (state, action) => {
    try {
      var response = await deleteSector(state.id);
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
  name: 'sector',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeSectorParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeSectorParameter.fulfilled]: (state, action) => {
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
    [changeSectorParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchSectorRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSectorRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords;
      state.count = Number(action.payload.count);
    },
    [fetchSectorRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertSectorRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertSectorRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('sector created successfully', 'success');
    },
    [insertSectorRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateSectorRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateSectorRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('sector updated successfully', 'success');
    },
    [updateSectorRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteSectorRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteSectorRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('sector deleted successfully', 'success');
    },
    [deleteSectorRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchSectorRecords, updateSectorRecord, insertSectorRecord, deleteSectorRecord, changeSectorParameter };

export default sectorSlice.reducer