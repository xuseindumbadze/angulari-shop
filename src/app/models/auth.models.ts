export interface SignUpRequest {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  zipcode: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE';
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  age?: number;
  address?: string;
  phone?: string;
  zipcode?: string;
  avatar?: string;
  gender?: 'MALE' | 'FEMALE';
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RecoveryRequest {
  email: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  address: string;
  phone: string;
  zipcode: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE';
  role: string;
  verified: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
}
