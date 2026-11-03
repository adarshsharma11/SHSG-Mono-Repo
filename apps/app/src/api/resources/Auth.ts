import { postData, type ApiResponse, type AxiosInstance, type RequestOptions } from '@shsg/api-client';

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: AuthUser;
}

export default function Auth(http: AxiosInstance) {
  function signup(payload: SignupRequest, { signal }: RequestOptions = {}) {
    return postData<ApiResponse<AuthUser>, SignupRequest>(http, '/auth/signup', payload, signal);
  }

  function login(payload: LoginRequest, { signal }: RequestOptions = {}) {
    return postData<ApiResponse<LoginResponse>, LoginRequest>(http, '/auth/login', payload, signal);
  }

  return { signup, login };
}
