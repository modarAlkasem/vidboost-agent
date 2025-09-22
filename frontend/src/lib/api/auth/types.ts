export type SignUpPayload = {
  email: string;
  password: string;
};

export type SignInPayload = SignUpPayload & {
  ip_address?: string;
  user_agent: string;
};

export type SignUpResponse = APIUser;

export type SignInResponse = APIUser & {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
};

export type SignInSocialPayload = {
  id_token: string;
  provider: "google";
  ip_address?: string;
  user_agent: string;
};

export type SignInSocialResponse = SignInResponse;
