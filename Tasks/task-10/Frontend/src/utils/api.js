import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 — clear storage and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const loginUser    = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const getTransactions     = (filters = {}) => API.get("/transactions", { params: filters });
export const getTransaction      = (id)           => API.get(`/transactions/${id}`);
export const createTransaction   = (data)         => API.post("/transactions", data);
export const updateTransaction   = (id, data)     => API.put(`/transactions/${id}`, data);
export const deleteTransaction   = (id)           => API.delete(`/transactions/${id}`);
export const getTransactionStats = (filters = {}) => API.get("/transactions/stats", { params: filters });

export const getBudgets            = ()       => API.get("/budgets");
export const getCurrentMonthBudgets = ()      => API.get("/budgets/current-month");
export const createBudget          = (data)   => API.post("/budgets", data);
export const updateBudget          = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget          = (id)     => API.delete(`/budgets/${id}`);

export default API;
