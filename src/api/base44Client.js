import { authAPI } from "@/utils/api";

// Compatibility facade for legacy public auth screens while using the local API.
export const base44 = {
  auth: {
    me: async () => {
      const response = await authAPI.getMe();
      return response?.data?.user || response?.user;
    },
    loginViaEmailPassword: async (email, password) => {
      const response = await authAPI.login({ email, password });
      const token = response?.token || response?.data?.token;
      if (token) localStorage.setItem("token", token);
      return response;
    },
    register: (data) =>
      authAPI.register({
        name: data.name || data.email.split("@")[0],
        email: data.email,
        password: data.password,
      }),
    logout: () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
    redirectToLogin: () => {
      window.location.href = "/login";
    },
    loginWithProvider: () => {
      throw new Error("Google login is not configured for local development.");
    },
    resetPasswordRequest: async () => {
      throw new Error(
        "Password reset is not configured for local development.",
      );
    },
    resetPassword: async () => {
      throw new Error(
        "Password reset is not configured for local development.",
      );
    },
    verifyOtp: async () => {
      throw new Error(
        "Email verification is not configured for local development.",
      );
    },
    resendOtp: async () => {
      throw new Error(
        "Email verification is not configured for local development.",
      );
    },
    setToken: (token) => localStorage.setItem("token", token),
  },
};
