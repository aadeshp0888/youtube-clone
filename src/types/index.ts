
// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  subscribers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Video Types
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoUploadData {
  title: string;
  description: string;
  videoFile: File;
  thumbnailFile: File;
}
