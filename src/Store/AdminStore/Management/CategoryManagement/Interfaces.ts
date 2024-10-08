import { Category } from "@/Store/UserStore/CommonManagements/interfaces";

export interface CategoryState {
    loadingCategory: boolean;
    category: Category[];
}

export interface addCategory {
    Name: string;
    token: string
}

export interface editCategory {
    Name: string;
    token: string;
    CategoryId: string;
}

export interface editCategoryResponse {
    message: string;
    status: number;
    Category: Category;
}

export interface addCategoryResponse {
    message: string;
    status: number;
    Category: Category;
}

export interface deleteCategory {
    token: string;
    id: string;
}

export interface deleteCategoryResponse {
    message: string;
    CategoryId: string;
    status: number;
}


export interface getCategory {
    token: string;
    skip: number;
    search: string;
}

export interface getCategoryResponse {
    message: string;
    Category: Category[];
    status: number;
    total: number
}

