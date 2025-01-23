/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from "@/config/api-client";
import { ProfileType } from "@/types/base-types";
import { useMutation } from "@tanstack/react-query";

type Variables = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type Response = ProfileType;

export const useRegister = () => {
    return useMutation<Response, any, Variables>({
        mutationFn: async (variables) => {
            const { data } = await ApiClient.post("/api/auth/register", variables) as any;
            return data.data as ProfileType;
        },
    });
};
