import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as interfaces from './interface';
import * as VoucherService from "./voucherService"
import { Voucher } from "@/Store/UserStore/Payment-Management/interface"

const initialState: interfaces.VoucherState = {
    voucher: [],
    loadingVoucher: false
};

export const addVoucher = createAsyncThunk<interfaces.addVoucherResponse, interfaces.addVoucher>(
    'VoucherAdmin/addVoucher',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await VoucherService.addVoucher(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.addVoucherResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const editVoucher = createAsyncThunk<interfaces.editVoucherResponse, interfaces.editVoucher>(
    'VoucherAdmin/editVoucher',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await VoucherService.editVoucher(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.editVoucherResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const deleteVoucher = createAsyncThunk<interfaces.deleteVoucherResponse, interfaces.deleteVoucher>(
    'VoucherAdmin/deleteVoucher',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await VoucherService.deleteVoucher(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.deleteVoucherResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);

export const getVoucher = createAsyncThunk<interfaces.getVoucherResponse, interfaces.getVoucher>(
    'VoucherAdmin/getVoucher',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await VoucherService.getVoucher(credentials)
            return response
        } catch (error) {
            return rejectWithValue(<interfaces.getVoucherResponse>{
                message: "Internal Server Error",
                status: 500
            });
        }
    }
);


const VoucherManagementSlice = createSlice({
    name: 'VoucherAdmin',
    initialState,
    reducers: {
        setVoucher(state, action: PayloadAction<Voucher[]>) {
            state.voucher = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loadingVoucher = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addVoucher.pending, (state) => {
                state.loadingVoucher = true;
            })
            .addCase(addVoucher.fulfilled, (state, action: PayloadAction<interfaces.addVoucherResponse>) => {
                state.loadingVoucher = false;
                if (action.payload.Voucher) {
                    state.voucher = [...state.voucher, action.payload.Voucher]
                }
            })
            .addCase(editVoucher.pending, (state) => {
                state.loadingVoucher = true;
            })
            .addCase(editVoucher.fulfilled, (state) => {
                state.loadingVoucher = false;
            })
            .addCase(deleteVoucher.pending, (state) => {
                state.loadingVoucher = true;
            })
            .addCase(deleteVoucher.fulfilled, (state) => {
                state.loadingVoucher = false;
            })
            .addCase(getVoucher.pending, (state) => {
                state.voucher = []
                state.loadingVoucher = true;
            })
            .addCase(getVoucher.fulfilled, (state, { payload }: PayloadAction<interfaces.getVoucherResponse>) => {
                state.loadingVoucher = false;
                state.voucher = payload.Voucher
            })

    },
});

export default VoucherManagementSlice.reducer;
