import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    loading: false,
};

const fetchUsers = createAsyncThunk('users/fetchUsers', async (state, action) => {
    console.log({ state, action });
    var res = await fetch('https://jsonplaceholder.typicode.com/users');
    return await res.json();
});

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchUsers.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.users = action.payload.map((p) => ({ ...p, _id: p.id, key: p.id }));
            state.loading = false;
        },
        [fetchUsers.rejected]: (state, action) => {
            alert(action.error.message);
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export { fetchUsers };

export default userSlice.reducer;
