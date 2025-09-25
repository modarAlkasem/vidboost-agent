export type SignUpPayload = {
  email: string;
  password: string;
};

export type SignInPayload = SignUpPayload & {
  ip_address?: string;
  user_agent: string;
};

export type SignUpResponse = APIUser;

export type SignInResponse = {
  user: APIUser;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
};

export type SignInSocialPayload = {
  access_token: string;
  id_token: string;
  provider: "google";
  email: string;
};

export type SignInSocialResponse = SignInResponse;

export type SignOutPayload = {
  refresh_token: string;
};
