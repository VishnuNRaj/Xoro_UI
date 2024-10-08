import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as interfaces from './Interfaces';
import * as CategoryService from "./CategoryService"
import { Category } from "@/Store/UserStore/CommonManagements/interfaces"

const initialState: interfaces.CategoryState = {
    category: [],
    loadingCategory: false
};

export const addCategory = createAsyncThunk<interfaces.addCategoryResponse, interfaces.addCategory>(
    'categoryAdmin/addCategory',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await CategoryService.addCategory(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.addCategoryResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const editCategory = createAsyncThunk<interfaces.editCategoryResponse, interfaces.editCategory>(
    'categoryAdmin/editCategory',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await CategoryService.editCategory(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.editCategoryResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const deleteCategory = createAsyncThunk<interfaces.deleteCategoryResponse, interfaces.deleteCategory>(
    'categoryAdmin/deleteCategory',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await CategoryService.deleteCategory(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.deleteCategoryResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const getCategory = createAsyncThunk<interfaces.getCategoryResponse, interfaces.getCategory>(
    'categoryAdmin/getCategory',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await CategoryService.getCategory(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.getCategoryResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);


const CategoryManagementSlice = createSlice({
    name: 'categoryAdmin',
    initialState,
    reducers: {
        setCategory(state, action: PayloadAction<Category[]>) {
            state.category = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loadingCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => {
                state.loadingCategory = true;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<interfaces.addCategoryResponse>) => {
                state.loadingCategory = false;
                if (action.payload.Category) {
                    state.category = [...state.category, action.payload.Category]
                }
            })
            .addCase(editCategory.pending, (state) => {
                state.loadingCategory = true;
            })
            .addCase(editCategory.fulfilled, (state) => {
                state.loadingCategory = false;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loadingCategory = true;
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.loadingCategory = false;
            })
            .addCase(getCategory.pending, (state) => {
                state.category = []
                state.loadingCategory = true;
            })
            .addCase(getCategory.fulfilled, (state, { payload }: PayloadAction<interfaces.getCategoryResponse>) => {
                state.loadingCategory = false;
                state.category = payload.Category
            })

    },
});

export const { setCategory, setLoading } = CategoryManagementSlice.actions;

export default CategoryManagementSlice.reducer;
