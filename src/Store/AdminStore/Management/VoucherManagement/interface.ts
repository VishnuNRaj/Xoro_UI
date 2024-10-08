import { Voucher } from "../../../UserStore/Payment-Management/interface"
export interface VoucherState {
    loadingVoucher: boolean;
    voucher: Voucher[];
}


export interface addVoucher {
    token:string;
    Name: string;
    From: string;
    End: string;
    Months: string;
    Description: string;
    Features: string[];
    Price: number;
    Type: "Monthly" | "Yearly" | "Bi Monthly" | "Special";
    Image: File;
}

export interface editVoucher {
    Name: string;
    token: string;
    VoucherId: string;
}

export interface editVoucherResponse {
    message: string;
    status: number;
    Voucher: Voucher;
}

export interface addVoucherResponse {
    message: string;
    status: number;
    Voucher: Voucher;
}

export interface deleteVoucher {
    token: string;
    id: string;
}

export interface deleteVoucherResponse {
    message: string;
    VoucherId: string;
    status: number;
}


export interface getVoucher {
    token: string;
}

export interface getVoucherResponse {
    message: string;
    Voucher: Voucher[];
    status: number;
    total: number
}

