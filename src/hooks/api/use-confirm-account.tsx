/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from "@/config/api-client";
import { useMutation } from "@tanstack/react-query";

type Variables = {
  email: string;
  otp: number;
};

type Response = {
  user: {
    isConfirmed: boolean;
  };
};

export const useConfirmAccount = () => {
  return useMutation<Response, any, Variables>({
    mutationFn: async (variables) => {
      const { data } = (await ApiClient.post(
        "/api/auth/account-confirmation",
        variables
      )) as any;
      return data.data;
    }
  });
};
