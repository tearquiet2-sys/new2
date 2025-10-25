const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://yourdomain.com/api"
    : "http://localhost:3000/api";

// Token yönetimi
const getToken = () => localStorage.getItem("auth_token");
const setToken = (token) => localStorage.setItem("auth_token", token);
const removeToken = () => localStorage.removeItem("auth_token");

// API istekleri için yardımcı fonksiyon
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Authentication API'leri
export const authAPI = {
  // Giriş yapma
  login: async (username, password) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  // Kayıt olma
  register: async (username, email, password) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  // Kullanıcı bilgilerini getir
  getMe: async () => {
    return await apiRequest("/auth/me");
  },

  // Çıkış yapma
  logout: async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      removeToken();
    }
  },

  // Token kontrolü
  isAuthenticated: () => !!getToken(),
};

// Rezervasyon API'leri
export const reservationAPI = {
  // Tüm rezervasyonları getir (admin)
  getReservations: async () => {
    return await apiRequest("/reservations");
  },

  // Yeni rezervasyon oluştur
  createReservation: async (reservationData) => {
    return await apiRequest("/reservations", {
      method: "POST",
      body: JSON.stringify(reservationData),
    });
  },

  // Rezervasyon güncelle
  updateReservation: async (id, updateData) => {
    return await apiRequest(`/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  // Rezervasyon sil
  deleteReservation: async (id) => {
    return await apiRequest(`/reservations/${id}`, {
      method: "DELETE",
    });
  },

  // Oda fiyatlarını getir
  getPrices: async () => {
    return await apiRequest("/reservations/prices");
  },

  // Kullanıcının rezervasyonlarını getir
  getUserReservations: async (userId) => {
    return await apiRequest(`/reservations/user/${userId}`);
  },
};

// Admin API'leri
export const adminAPI = {
  // Dashboard verilerini getir
  getDashboard: async () => {
    return await apiRequest("/admin/dashboard");
  },

  // Kullanıcıları getir
  getUsers: async () => {
    return await apiRequest("/admin/users");
  },

  // Yeni kullanıcı oluştur
  createUser: async (userData) => {
    return await apiRequest("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Kullanıcı sil
  deleteUser: async (id) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  // Fiyatları güncelle
  updatePrices: async (prices) => {
    return await apiRequest("/admin/prices", {
      method: "PUT",
      body: JSON.stringify({ prices }),
    });
  },

  // Tüm rezervasyonları temizle
  clearReservations: async () => {
    return await apiRequest("/admin/reservations/clear", {
      method: "DELETE",
    });
  },

  // Rezervasyon onayla
  approveReservation: async (id) => {
    return await apiRequest(`/admin/reservations/${id}/approve`, {
      method: "PUT",
    });
  },

  // Rezervasyon reddet
  rejectReservation: async (id) => {
    return await apiRequest(`/admin/reservations/${id}/reject`, {
      method: "PUT",
    });
  },
};

// Health check
export const healthCheck = async () => {
  return await apiRequest("/health");
};

export default {
  authAPI,
  reservationAPI,
  adminAPI,
  healthCheck,
};
