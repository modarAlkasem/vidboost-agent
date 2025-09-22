import api from "@/lib/axios";
import {
  SignUpPayload,
  SignInPayload,
  SignInResponse,
  SignUpResponse,
  SignInSocialPayload,
  SignInSocialResponse,
} from "./types";

export const signUp = async ({ email, password }: SignUpPayload) => {
  const response = await api.post<ApiResponse<SignUpResponse>>(
    "/auth/signup/",
    {
      email,
      password,
    }
  );
  return response.data.data;
};

export const signIn = async ({
  email,
  password,
  ip_address,
  user_agent,
}: SignInPayload) => {
  const response = await api.post<ApiResponse<SignInResponse>>(
    "/auth/signin/",
    {
      email,
      password,
      ip_address,
      user_agent,
    }
  );
  return response.data.data;
};

export const signInSocial = async ({
  id_token,
  provider,
  user_agent,
  ip_address,
}: SignInSocialPayload) => {
  const response = await api.post<ApiResponse<SignInSocialResponse>>(
    "/auth/social/signin/",
    {
      id_token,
      provider,
      user_agent,
      ip_address,
    }
  );
  return response.data.data;
};
