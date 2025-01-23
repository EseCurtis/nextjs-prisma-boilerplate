/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from "@/config/api-client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
    entityId: string | number;
};

type Response = any;

export const useGet_Entity_ = (variables: Variables) => {
    const { getToken } = useAuth();
    return useQuery<Response>({
        queryKey: ["entity", variables.entityId],
        queryFn: async () => {
            const { entityId } = variables;

            const { data } = (await ApiClient.get(`/path/to/route/${entityId}`, {
                headers: {
                    Authorization: "Bearer " + getToken()
                }
            })) as any;

            return data.data as Response;
        }
    });
};
