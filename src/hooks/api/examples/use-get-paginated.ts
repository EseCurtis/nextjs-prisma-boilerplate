/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from "@/config/api-client";
import { PaginationType } from "@/types/base-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
    search?: string;
};
type Response = PaginationType<any>;

export const useGetPaginated_Entity_ = (variables: Variables) => {
    const { getToken } = useAuth();
    return useInfiniteQuery<Response>({
        initialPageParam: 1,
        queryKey: ["paginated", "entity", variables],
        queryFn: async ({ pageParam = 1 }) => {
            const { search } = variables;

            const { data } = await ApiClient.get(
                `/path/to/route`,
                {
                    params: {
                        page: pageParam,
                        search,
                    },
                    headers: {
                        Authorization: "Bearer " + getToken()
                    }
                }
            );

            return data as Response;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.nextPage ?? undefined;
        }
    });
};
