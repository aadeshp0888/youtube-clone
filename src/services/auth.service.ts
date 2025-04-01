
import { AuthResponse, LoginCredentials, SignupCredentials, User } from "@/types";

const API_URL = "https://api.example.com"; // Replace with your actual API URL

// Mock implementation for demo purposes
// In a real app, these would make actual API calls
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    console.log("Logging in with:", credentials);
    
    // Mock successful response
    return {
      user: {
        id: "1",
        username: "johnsmith",
        email: credentials.email,
        profilePicture: "https://i.pravatar.cc/150?u=johnsmith",
        subscribers: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: "mock-jwt-token",
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API call
    console.log("Signing up with:", credentials);
    
    // Mock successful response
    return {
      user: {
        id: "1",
        username: credentials.username,
        email: credentials.email,
        profilePicture: "https://i.pravatar.cc/150?u=" + credentials.username,
        subscribers: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: "mock-jwt-token",
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  saveUserData(userData: AuthResponse): void {
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
