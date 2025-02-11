import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import { fetchCustomerReports, generateReport } from '../../apis/customer-reports.api';
import moment from 'moment';

const initialState = {
    records: [],
    loading: false,
    pageNo: 0,
    count: 0,
    keywords: '',
    limit: 5,
    sortBy: -1,
    from_date: moment().subtract(1, 'days').format('DD/MM/YYYY'),
    to_date: moment().format('DD/MM/YYYY'),
    sortField: '_id',
};

const changeCustomerParameter = createAsyncThunk(
    'customer-report/changeCustomerParameter',
    async (state, action) => {
        return state;
    },
);

const fetchCustomerRecords = createAsyncThunk(
    'customer-report/fetchCustomerRecords',
    async (state, action) => {
        try {
            var response = await fetchCustomerReports(state);
            var result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const generateCustomerReport = createAsyncThunk(
    'customer-report/generateCustomerReport',
    async (state, action) => {
        try {
            // { from_date, to_date }
            var response = await generateReport(state);
            var result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

// const StatusChangeCustomerRecord = createAsyncThunk(
//   'customer-report/statusChangeCustomerRecord',
//   async (state, action) => {
//     try {
//       var response = await StatusChangeCustomer(state);
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

// const insertCustomerRecord = createAsyncThunk(
//   'customer-report/insertCustomerRecord',
//   async (state, action) => {
//     try {
//       var response = await insertCustomer(state);
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

// const updateCustomerRecord = createAsyncThunk(
//   'customer-report/updateCustomerRecord',
//   async (state, action) => {
//     try {
//       var response = await updateCustomer(state);
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

// const deleteGrantRecord = createAsyncThunk(
//   'customer-report/deleteGrantRecord',
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

export const customerReportSlice = createSlice({
    name: 'customer-report',
    initialState,
    reducers: {},
    extraReducers: {
        [changeCustomerParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeCustomerParameter.fulfilled]: (state, action) => {
            const {
                pageNo,
                limit,
                sortBy,
                sortField,
                keywords,
                count,
                from_date,
                to_date,
            } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;

            if (from_date) {
                state.from_date = from_date;
            }
            if (to_date) {
                state.to_date = to_date;
            }
        },
        [changeCustomerParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchCustomerRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchCustomerRecords.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload.result.map((p) => ({
                ...p,
                _id: p._id,
                key: p._id,
            }));

            state.pageNo = Number(action.payload.pageNo);
            state.limit = Number(action.payload.limit);
            state.sortBy = Number(action.payload.sortBy);
            state.sortField = action.payload.sortField;
            state.count = Number(action.payload.count);
        },
        [fetchCustomerRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [generateCustomerReport.fulfilled]: (state, action) => {
            toast_popup('customer report generated successfully', 'success');
        },
        [generateCustomerReport.rejected]: (state, action) => {
            toast_popup('failed to generate report successfully', 'error');
        },
        // [StatusChangeCustomerRecord.pending]: (state, action) => {
        //   state.loading = true;
        // },
        // [StatusChangeCustomerRecord.fulfilled]: (state, action) => {
        //   state.loading = false;
        //   toast_popup('customer status changed successfully', 'success');
        // },
        // [StatusChangeCustomerRecord.rejected]: (state, action) => {
        //   toast_popup(action.error.message, 'error')
        //   state.loading = false;
        // },
        // [insertCustomerRecord.pending]: (state, action) => {
        //   state.loading = true;
        // },
        // [insertCustomerRecord.fulfilled]: (state, action) => {
        //   state.loading = false;
        //   toast_popup('customer created successfully', 'success');
        // },
        // [insertCustomerRecord.rejected]: (state, action) => {
        //   toast_popup(action.error.message, 'error')
        //   state.loading = false;
        // },
        // [updateCustomerRecord.pending]: (state, action) => {
        //   state.loading = true;
        // },
        // [updateCustomerRecord.fulfilled]: (state, action) => {
        //   state.loading = false;
        //   toast_popup('customer updated successfully', 'success');
        // },
        // [updateCustomerRecord.rejected]: (state, action) => {
        //   toast_popup(action.error.message, 'error')
        //   state.loading = false;
        // },
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
    },
});

// Action creators are generated for each case reducer function
export { fetchCustomerRecords, changeCustomerParameter, generateCustomerReport };

export default customerReportSlice.reducer;
