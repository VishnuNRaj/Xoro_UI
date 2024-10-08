import * as interfaces from "./interface";
import axios from "axios";
import config from "@/Configs/config";
axios.interceptors.request.use(config => {
    config.withCredentials = true;
    return config
})
export const addVoucher = async ({ Description, End, Features, From, Image, Months, Name, Price, Type, token }: interfaces.addVoucher): Promise<interfaces.addVoucherResponse> => {
    try {
        const from = new FormData()
        from.append("Image", Image);
        from.append("Name", Name);
        from.append("From", From);
        from.append("End", End)
        from.append("Description", Description)
        from.append("Months", Months)
        Features.forEach((value) => {
            from.append("Features", value)
        })
        from.append("Price", Price.toString());
        from.append("Type", Type)
        const response = await axios.post(`${config.ADMIN}/voucher`, from, {
            headers: {
                Authorization: token
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.addVoucherResponse>{
            message: "Internal Server Error",
            status: 500
        }
    }
}

export const editVoucher = async (data: interfaces.editVoucher): Promise<interfaces.editVoucherResponse> => {
    try {
        const response = await axios.put(`${config.ADMIN}/voucher/${data.VoucherId}`, data, {
            headers: {
                Authorization: data.token
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.editVoucherResponse>{
            message: "Internal Server Error",
            status: 500
        }
    }
}


export const deleteVoucher = async (data: interfaces.deleteVoucher): Promise<interfaces.deleteVoucherResponse> => {
    try {
        const response = await axios.delete(`${config.ADMIN}/voucher/${data.id}`, {
            headers: {
                Authorization: data.token
            }
        })
        console.log(response.data)
        return response.data
    } catch (e) {
        return <interfaces.deleteVoucherResponse>{
            message: "Internal Server Error",
            status: 500
        }
    }
}

export const getVoucher = async (data: interfaces.getVoucher): Promise<interfaces.getVoucherResponse> => {
    try {
        const response = await axios.get(`${config.ADMIN}/voucher`, {
            headers: {
                Authorization: `${data.token}`
            },
            withCredentials: true
        })
        return response.data
    } catch (e) {
        return <interfaces.getVoucherResponse>{
            message: "Internal Server Error",
            status: 500
        }
    }
}
