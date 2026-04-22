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
