import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast_popup } from '../../utils/toast';
import { fetchCustomers, insertCustomer, StatusChangeCustomer, updateCustomer } from '../../apis/customer.api';

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

const changeCustomerParameter = createAsyncThunk(
  'customer/changeCustomerParameter',
  async (state, action) => {
    return state;
  }
)

const fetchCustomerRecords = createAsyncThunk(
  'customer/fetchCustomerRecords',
  async (state, action) => {
    try {
      // { pageNo, limit, sortBy, sortField, keywords }
      var response = await fetchCustomers(state);
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

const StatusChangeCustomerRecord = createAsyncThunk(
  'customer/statusChangeCustomerRecord',
  async (state, action) => {
    try {
      var response = await StatusChangeCustomer(state);
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

const insertCustomerRecord = createAsyncThunk(
  'customer/insertCustomerRecord',
  async (state, action) => {
    try {
      var response = await insertCustomer(state);
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

const updateCustomerRecord = createAsyncThunk(
  'customer/updateCustomerRecord',
  async (state, action) => {
    try {
      var response = await updateCustomer(state);
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

// const deleteGrantRecord = createAsyncThunk(
//   'customer/deleteGrantRecord',
//   async (state, action) => {
//     try {
//       var response = await deleteGrant(state.id);
//       var result = response.data;

//       if(!result.success) {
//         throw new Error(result.message || 'Something went wrong!');
//       }
//       return result.result;
//     }
//     catch(err) {
//       throw new Error(err?.response?.data?.message || err.message)
//     }
//   }
// )

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
  },
  extraReducers: {
    [changeCustomerParameter.pending]: (state, action) => {
      // state.loading = true;
    },
    [changeCustomerParameter.fulfilled]: (state, action) => {
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
    [changeCustomerParameter.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [fetchCustomerRecords.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCustomerRecords.fulfilled]: (state, action) => {
      state.records = action.payload.result.map(p => ({...p, _id: p._id, key: p._id}));
      state.loading = false;

      state.pageNo = Number(action.payload.pageNo);
      state.limit = Number(action.payload.limit);
      state.sortBy = Number(action.payload.sortBy);
      state.sortField = action.payload.sortField;
      state.keywords = action.payload.keywords || '';
      state.count = Number(action.payload.count);
    },
    [fetchCustomerRecords.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [StatusChangeCustomerRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [StatusChangeCustomerRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('customer status changed successfully', 'success');
    },
    [StatusChangeCustomerRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [insertCustomerRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [insertCustomerRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('customer created successfully', 'success');
    },
    [insertCustomerRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    [updateCustomerRecord.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCustomerRecord.fulfilled]: (state, action) => {
      state.loading = false;
      toast_popup('customer updated successfully', 'success');
    },
    [updateCustomerRecord.rejected]: (state, action) => {
      toast_popup(action.error.message, 'error')
      state.loading = false;
    },
    // [deleteGrantRecord.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [deleteGrantRecord.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   toast_popup('grant deleted successfully', 'success');
    // },
    // [deleteGrantRecord.rejected]: (state, action) => {
    //   toast_popup(action.error.message, 'error')
    //   state.loading = false;
    // },
  }
})

// Action creators are generated for each case reducer function
export { fetchCustomerRecords, changeCustomerParameter, StatusChangeCustomerRecord, insertCustomerRecord, updateCustomerRecord };

export default customerSlice.reducer