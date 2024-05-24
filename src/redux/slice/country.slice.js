import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { deleteCountry, fetchCountries, insertCountry, updateCountry } from '../../apis/master/country.api';

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

const changeCountryParameter = createAsyncThunk(
  'country/changeCountryParameter',
  async (state, action) => {
    return state;
  }
)

const fetchCountryRecords = createAsyncThunk(
  'country/fetchCountryRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchCountries(state);
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

const insertCOuntryRecord = createAsyncThunk(
  'country/insertCOuntryRecord',
  async (state, action) => {
    try {
      var response = await insertCountry(state);
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

const updateCountryRecord = createAsyncThunk(
  'country/updateCountryRecord',
  async (state, action) => {
    try {
      var response = await updateCountry(state);
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

const deleteCountryRecord = createAsyncThunk(
  'country/deleteCountryRecord',
  async (state, action) => {
    try {
      var response = await deleteCountry(state.id);
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

export const countrylice = createSlice({
  name: 'country',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeCountryParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeCountryParameter.fulfilled]: (state, action) => {
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
    [changeCountryParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchCountryRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCountryRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords;
      state.count = Number(action.payload.count);
    },
    [fetchCountryRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertCOuntryRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertCOuntryRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('Country created successfully', 'success');
    },
    [insertCOuntryRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateCountryRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCountryRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('Country updated successfully', 'success');
    },
    [updateCountryRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [deleteCountryRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCountryRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('Country deleted successfully', 'success');
    },
    [deleteCountryRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
  }
})

// Action creators are generated for each case reducer function
export { fetchCountryRecords, updateCountryRecord, insertCOuntryRecord, deleteCountryRecord, changeCountryParameter };

export default countrylice.reducer