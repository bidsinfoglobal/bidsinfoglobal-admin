import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import { fetchGrants, insertGrant, updateGrant, deleteGrant } from '../../apis/grant.api';

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

const changeGrantParameter = createAsyncThunk(
    'state/changeGrantParameter',
    async (state, action) => {
        return state;
    },
);

const fetchGrantRecords = createAsyncThunk(
    'state/fetchGrantRecords',
    async (state, action) => {
        try {
            // { pageNo, limit, sortBy, sortField, keywords }
            var response = await fetchGrants(state);
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

const insertGrantRecord = createAsyncThunk(
    'state/insertGrantRecord',
    async (state, action) => {
        try {
            var response = await insertGrant(state);
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

const updateGrantRecord = createAsyncThunk(
    'state/updateGrantRecord',
    async (state, action) => {
        try {
            var response = await updateGrant(state);
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

const deleteGrantRecord = createAsyncThunk(
    'state/deleteGrantRecord',
    async (state, action) => {
        try {
            var response = await deleteGrant(state.id);
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

export const regionSlice = createSlice({
    name: 'grant',
    initialState,
    reducers: {},
    extraReducers: {
        [changeGrantParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeGrantParameter.fulfilled]: (state, action) => {
            const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;
        },
        [changeGrantParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchGrantRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchGrantRecords.fulfilled]: (state, action) => {
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
            state.keywords = action.payload.keywords || '';
            state.count = Number(action.payload.count);
            state.query = JSON.stringify(action.payload.query);
        },
        [fetchGrantRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertGrantRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertGrantRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('grant created successfully', 'success');
        },
        [insertGrantRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updateGrantRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updateGrantRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('grant updated successfully', 'success');
        },
        [updateGrantRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [deleteGrantRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteGrantRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('grant deleted successfully', 'success');
        },
        [deleteGrantRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export {
    fetchGrantRecords,
    updateGrantRecord,
    insertGrantRecord,
    deleteGrantRecord,
    changeGrantParameter,
};

export default regionSlice.reducer;
