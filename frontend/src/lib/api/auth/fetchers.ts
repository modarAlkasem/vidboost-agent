import api from "@/lib/axios";
import {
  SignUpPayload,
  SignInPayload,
  SignInResponse,
  SignUpResponse,
  SignInSocialPayload,
  SignInSocialResponse,
  SignOutPayload,
} from "./types";

export const signUpFetcher = async ({ email, password }: SignUpPayload) => {
  const response = await api.post<ApiResponse<SignUpResponse>>(
    "/auth/signup/",
    {
      email,
      password,
    }
  );
  return response.data;
};

export const signInFetcher = async ({
  email,
  password,
  ip_address,
  user_agent,
}: SignInPayload) => {
  const response = await api.post<SignInResponse>("/auth/signin/", {
    email,
    password,
    ip_address,
    user_agent,
  });
  return response.data;
};

export const signInSocialFetcher = async ({
  id_token,
  access_token,
  provider,
  email,
}: SignInSocialPayload) => {
  const response = await api.post<SignInSocialResponse>(
    "/auth/social/signin/",
    {
      email,
      id_token,
      access_token,
      provider,
    }
  );
  return response.data;
};

export const signOutFetcher = async ({ refresh_token }: SignOutPayload) => {
  await api.post<null>("/auth/signout/", {
    refresh_token,
  });
};
