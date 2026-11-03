import { postData, type ApiResponse, type AuthUser, type AxiosInstance, type LoginRequest, type LoginResponse, type RequestOptions, type SignupRequest } from '@shsg/api-client';

export default function Auth(http: AxiosInstance) {
  function signup(payload: SignupRequest, { signal }: RequestOptions = {}) {
    return postData<ApiResponse<AuthUser>, SignupRequest>(http, '/auth/signup', payload, signal);
  }

  function login(payload: LoginRequest, { signal }: RequestOptions = {}) {
    return postData<ApiResponse<LoginResponse>, LoginRequest>(http, '/auth/login', payload, signal);
  }

  return { signup, login };
}
