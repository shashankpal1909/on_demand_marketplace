import apiClient from "@/api/client";

import type {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "@/lib/dtos";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  username: string;
}

class AuthService {
  async changePassword(dto: ChangePasswordDTO): Promise<void> {
    const response = await apiClient.post(`/users/change-password`, dto);
    return response.data;
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const response = await apiClient.post(`/users/forgot-password`, dto);
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await apiClient.get<User>("/users/current-user");
    return response.data;
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const response = await apiClient.post(`/users/reset-password`, dto);
    return response.data;
  }

  async signIn(dto: SignInDTO): Promise<Token> {
    const formData = new FormData();
    formData.append("username", dto.username);
    formData.append("password", dto.password);

    const response = await apiClient.post<Token>("/users/sign-in", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async signOut(): Promise<void> {
    const response = await apiClient.post("/users/sign-out");
    return response.data;
  }

  async signUp(dto: SignUpDTO): Promise<{ user: User; access_token: string }> {
    const response = await apiClient.post("/users/sign-up", dto);
    return response.data;
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post(`/users/verify-email/${token}`);
    return response.data;
  }
}

const authService = new AuthService();

export default authService;
