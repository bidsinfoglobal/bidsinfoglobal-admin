import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    fetchProjects,
    insertProject,
    updateProject,
    deleteProject,
} from '../../apis/project.api';

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

const changeProjectParameter = createAsyncThunk(
    'project/changeProjectParameter',
    async (state, action) => {
        return state;
    },
);

const fetchProjectRecords = createAsyncThunk(
    'project/fetchProjectRecords',
    async (state, action) => {
        try {
            // { pageNo, limit, sortBy, sortField, keywords }
            var response = await fetchProjects(state);
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

const insertProjectRecord = createAsyncThunk(
    'project/insertProjectRecord',
    async (state, action) => {
        try {
            var response = await insertProject(state);
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

const updatePorjectRecord = createAsyncThunk(
    'project/updatePorjectRecord',
    async (state, action) => {
        try {
            var response = await updateProject(state);
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

const deleteProjectRecord = createAsyncThunk(
    'project/deleteProjectRecord',
    async (state, action) => {
        try {
            var response = await deleteProject(state.id);
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

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {},
    extraReducers: {
        [changeProjectParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeProjectParameter.fulfilled]: (state, action) => {
            const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;
        },
        [changeProjectParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchProjectRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchProjectRecords.fulfilled]: (state, action) => {
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
        [fetchProjectRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertProjectRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertProjectRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('project created successfully', 'success');
        },
        [insertProjectRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updatePorjectRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updatePorjectRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('project updated successfully', 'success');
        },
        [updatePorjectRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [deleteProjectRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteProjectRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('project deleted successfully', 'success');
        },
        [deleteProjectRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export {
    fetchProjectRecords,
    updatePorjectRecord,
    insertProjectRecord,
    deleteProjectRecord,
    changeProjectParameter,
};

export default projectSlice.reducer;
