import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  requestPasswordReset: (data) =>
    api.post("/auth/password-reset/request", data),
  verifyPasswordResetOtp: (data) =>
    api.post("/auth/password-reset/verify", data),
  resetPassword: (data) => api.post("/auth/password-reset/complete", data),
};

export const contentAPI = {
  getByPage: (page) => api.get(`/content/${page}`),
  getBySection: (page, section) => api.get(`/content/${page}/${section}`),
  create: (data) => api.post("/content", data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get("/services"),
  getByType: (type) => api.get(`/services/type/${type}`),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const uploadAPI = {
  uploadSingle: (formData) => api.post("/upload/single", formData),
  uploadCv: (formData) => api.post("/upload/cv", formData),
  uploadMultiple: (formData) => api.post("/upload/multiple", formData),
  delete: (id) => api.delete(`/upload/${id}`),
  getAll: () => api.get("/upload"),
};

export const heroImageAPI = {
  getAll: async () => {
    const response = await uploadAPI.getAll();
    return (response?.data || [])
      .filter((image) => image.section === "hero" && image.url)
      .sort((first, second) => (first.order || 0) - (second.order || 0))
      .map((image) => image.url);
  },
};

export const sisterConcernAPI = {
  getAll: () => api.get("/sister-concern"),
  create: (data) => api.post("/sister-concern", data),
  update: (id, data) => api.put(`/sister-concern/${id}`, data),
  delete: (id) => api.delete(`/sister-concern/${id}`),
};

export const partnerCompanyAPI = {
  getAll: () => api.get("/partner-companies"),
  create: (data) => api.post("/partner-companies", data),
  delete: (id) => api.delete(`/partner-companies/${id}`),
};

export const heroSlideAPI = {
  getAll: () => api.get("/hero-slides"),
  create: (data) => api.post("/hero-slides", data),
  update: (id, data) => api.put(`/hero-slides/${id}`, data),
  delete: (id) => api.delete(`/hero-slides/${id}`),
};

export const contactSettingsAPI = {
  get: () => api.get("/contact-settings"),
  update: (data) => api.put("/contact-settings", data),
};

export const contactAPI = {
  sendMessage: (data) => api.post("/contact", data),
  getMessages: () => api.get("/contact-messages"),
  updateReadStatus: (id, read) =>
    api.patch(`/contact-messages/${id}/read`, { read }),
  deleteMessage: (id) => api.delete(`/contact-messages/${id}`),
};

export const careerAPI = {
  getAll: () => api.get("/career"),
  getAllAdmin: () => api.get("/career/admin/all"),
  create: (data) => api.post("/career", data),
  update: (id, data) => api.put(`/career/${id}`, data),
  delete: (id) => api.delete(`/career/${id}`),
};

export const applicationAPI = {
  create: (data) => api.post("/application", data),
  getAll: () => api.get("/application"),
  getById: (id) => api.get(`/application/${id}`),
  downloadCv: (id) =>
    api.get(`/application/${id}/cv`, { responseType: "blob" }),
  updateStatus: (id, data) => api.put(`/application/${id}/status`, data),
  delete: (id) => api.delete(`/application/${id}`),
};

export default api;
