/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from "@/config/api-client";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = any;
type Response = any;

export const useCreate_Entity_ = () => {
    const { getToken } = useAuth();
    return useMutation<Response, any, Variables>({
        mutationFn: async (variables) => {
            const { data } = (await ApiClient.post(
                "/path/to/route",
                variables,
                {
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                }
            )) as any;
            return data.data as any;
        }
    });
};

/*

type Variables = {
    property: type;
    ...
};
type Response = {
    property: type;
    ...
};

*/