// Data transfer object definitions

export interface SignInDTO {
  username: string;
  password: string;
}

export interface SignUpDTO {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}
