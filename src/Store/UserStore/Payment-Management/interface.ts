export interface Voucher {
    CreatedAt: string;
    From: string;
    End: string;
    Description: string;
    Price: number;
    Discount:number;
    Type: "Monthly" | "Yearly" | "Bi Monthly" | "Special";
    Name: string;
    Features: string[];
    Months: number;
    Thumbnail:string;
}