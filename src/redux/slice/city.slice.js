import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    fetchStates,
    insertState,
    updateState,
    deleteState,
} from '../../apis/master/state.api';
import {
    deleteCity,
    fetchCities,
    insertCity,
    updateCity,
} from '../../apis/master/city.api';

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

const changeCityParameter = createAsyncThunk(
    'state/changeCityParameter',
    async (state, action) => {
        return state;
    },
);

const fetchCityRecords = createAsyncThunk(
    'state/fetchCityRecords',
    async (state, action) => {
        try {
            // { pageNo, limit, sortBy, sortField, keywords }
            console.log(state);
            var response = await fetchCities(state);
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

const insertCityRecord = createAsyncThunk(
    'city/insertCityRecord',
    async (state, action) => {
        try {
            var response = await insertCity(state);
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

const updateCityRecord = createAsyncThunk(
    'city/updateCityRecord',
    async (state, action) => {
        try {
            var response = await updateCity(state);
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

const deleteCityRecord = createAsyncThunk(
    'city/deleteCityRecord',
    async (state, action) => {
        try {
            var response = await deleteCity(state.id);
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

export const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {},
    extraReducers: {
        [changeCityParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeCityParameter.fulfilled]: (state, action) => {
            const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;
        },
        [changeCityParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchCityRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchCityRecords.fulfilled]: (state, action) => {
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
        [fetchCityRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertCityRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertCityRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('city created successfully', 'success');
        },
        [insertCityRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updateCityRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updateCityRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('city updated successfully', 'success');
        },
        [updateCityRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [deleteCityRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteCityRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('city deleted successfully', 'success');
        },
        [deleteCityRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export {
    fetchCityRecords,
    updateCityRecord,
    insertCityRecord,
    deleteCityRecord,
    changeCityParameter,
};

export default citySlice.reducer;
