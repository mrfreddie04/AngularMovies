export interface UserCredentialsDTO {
  email: string;
  password: string;
}

export interface AccountDTO {
  email: string;
  role: string;
}

export interface UserDTO {
  id: string;
  email: string;
}

export interface AuthenticationResponseDTO {
  token: string;
  expiration: Date;
}
