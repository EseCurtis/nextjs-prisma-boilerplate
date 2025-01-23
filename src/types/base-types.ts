import { UserRole } from "@prisma/client";

export type AuthUserType = {
   
    userId: string,
    email: string,
    role: UserRole
}



export type ProfileType = {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    isConfirmed: boolean;
}

export type PaginationType<ListType> = {
    data: ListType[]
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextPage: number | null
    }
}

export type PaginateQuery<T> = {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
};


