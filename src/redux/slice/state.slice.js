import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    fetchStates,
    insertState,
    updateState,
    deleteState,
} from '../../apis/master/state.api';

const initialState = {
    records: [],
    loading: false,
    pageNo: 0,
    count: 0,
    keywords: '',
    limit: 5,
    sortBy: -1,
    sortField: '_id',
};

const changeStateParameter = createAsyncThunk(
    'state/changeStateParameter',
    async (state, action) => {
        return state;
    },
);

const fetchStateRecords = createAsyncThunk(
    'state/fetchStateRecords',
    async (state, action) => {
        try {
            // { pageNo, limit, sortBy, sortField, keywords }
            var response = await fetchStates(state);
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

const insertStateRecord = createAsyncThunk(
    'state/insertStateRecord',
    async (state, action) => {
        try {
            var response = await insertState(state);
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

const updateStateRecord = createAsyncThunk(
    'state/updateStateRecord',
    async (state, action) => {
        try {
            var response = await updateState(state);
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

const deleteStateRecord = createAsyncThunk(
    'state/deleteStateRecord',
    async (state, action) => {
        try {
            var response = await deleteState(state.id);
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

export const statelice = createSlice({
    name: 'state',
    initialState,
    reducers: {},
    extraReducers: {
        [changeStateParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeStateParameter.fulfilled]: (state, action) => {
            const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;
        },
        [changeStateParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchStateRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchStateRecords.fulfilled]: (state, action) => {
            state.records = action.payload.result.map((p) => ({
                ...p,
                _id: p._id,
                key: p._id,
            }));
            state.loading = false;

            state.pageNo = Number(action.payload.pageNo);
            state.limit = Number(action.payload.limit);
            state.sortBy = Number(action.payload.sortBy);
            state.sortField = action.payload.sortField;
            state.keywords = action.payload.keywords;
            state.count = Number(action.payload.count);
        },
        [fetchStateRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertStateRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertStateRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('state created successfully', 'success');
        },
        [insertStateRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updateStateRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updateStateRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('state updated successfully', 'success');
        },
        [updateStateRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [deleteStateRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteStateRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('state deleted successfully', 'success');
        },
        [deleteStateRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export {
    fetchStateRecords,
    updateStateRecord,
    insertStateRecord,
    deleteStateRecord,
    changeStateParameter,
};

export default statelice.reducer;
