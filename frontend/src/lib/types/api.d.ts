type JsonPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | symbol;

type JsonArray = Json[];

type JsonRecord<T> = {
  [Property in keyof T]: Json;
};

type Json<T = any> = JsonPrimitive | JsonArray | JsonRecord<T>;

interface ApiResponse<T> {
  data: T;
  status_code: number;
  status_text: string;
}

interface ErrorResponse extends Omit<ApiResponse, "data"> {
  errors: Json;
}

interface APIUser {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  last_signed_in: string | null;
  disabled: boolean;
  created_at: string;
  updated_at: string;
}
