import { JwtPayload, jwtDecode } from "jwt-decode";

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload & { username?: string }>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        return decoded.exp * 1000 < Date.now();
      }
      return false;
    } catch (error) {
      console.error("Invalid token format:", error);
      return true;
    }
  }

  getToken(): string | null {
    // Retrieve the token from localStorage
    return localStorage.getItem("jwtToken");
  }

  login(idToken: string) {
    // Store the token in localStorage
    localStorage.setItem("jwtToken", idToken);
    window.location.assign("/"); // Redirect to home or dashboard
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem("jwtToken");
    window.location.assign("/login"); // Redirect to login page
  }
}

export default new AuthService();
