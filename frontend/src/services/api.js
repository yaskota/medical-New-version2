import axios from "axios";

// Chatbot API (Flask backend on port 5000 - already has CORS enabled)
const CHATBOT_API = "http://localhost:5000/api";

// Server API - uses Vite proxy (see vite.config.js) to forward to port 8000
const SERVER_API = "http://localhost:8000/api";

// Create axios instance for server API with credentials
const serverAxios = axios.create({
  baseURL: SERVER_API,
  withCredentials: true,
});

// ──── Chatbot APIs ─────────────────────────────────────────
export const createSession = async () => {
  const res = await axios.post(`${CHATBOT_API}/session`);
  return res.data;
};

export const sendMessage = async (sessionId, message) => {
  const res = await axios.post(`${CHATBOT_API}/chat`, {
    session_id: sessionId,
    message: message,
  });
  return res.data;
};

export const resetSession = async (sessionId) => {
  const res = await axios.post(`${CHATBOT_API}/reset`, {
    session_id: sessionId,
  });
  return res.data;
};

// ──── Auth APIs ────────────────────────────────────────────
export const registerUser = async (data) => {
  const res = await serverAxios.post("/auth/register", data);
  return res.data;
};

export const verifyOTP = async (data) => {
  const res = await serverAxios.post("/auth/verify-otp", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await serverAxios.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await serverAxios.post("/auth/logout");
  return res.data;
};

// ──── Doctor APIs ──────────────────────────────────────────
export const createDoctorProfile = async (data) => {
  const res = await serverAxios.post("/doctors/create", data);
  return res.data;
};

export const getDoctorProfile = async () => {
  const res = await serverAxios.get("/doctors/profile");
  console.log(res.data);
  return res.data;
  
};

export const getPendingDoctors = async () => {
  const res = await serverAxios.get("/doctors/pending");
  return res.data;
};

export const approveDoctor = async (id) => {
  const res = await serverAxios.patch(`/doctors/approve/${id}`);
  return res.data;
};

// ──── Hospital APIs ────────────────────────────────────────
export const createHospital = async (data) => {
  const res = await serverAxios.post("/hospitals/create", data);
  return res.data;
};

export const getMyHospital = async () => {
  const res = await serverAxios.get("/hospitals/my");
  return res.data;
};

export const getHospitalById = async (id) => {
  const res = await serverAxios.get(`/hospitals/${id}`);
  return res.data;
};

export const getAllHospitals = async () => {
  const res = await serverAxios.get("/hospitals");
  return res.data;
};

export const addDoctorToHospital = async (data) => {
  const res = await serverAxios.post("/hospitals/add-doctor", data);
  return res.data;
};

export const approveHospital = async (id) => {
  const res = await serverAxios.patch(`/hospitals/approve/${id}`);
  return res.data;
};

export const getHospitalDoctors = async (id) => {
  const res = await serverAxios.get(`/hospitals/${id}/doctors`);
  return res.data;
};

// ──── Department APIs ──────────────────────────────────────
export const createDepartment = async (data) => {
  const res = await serverAxios.post("/departments/create", data);
  return res.data;
};

export const addDoctorsToDepartment = async (data) => {
  const res = await serverAxios.post("/departments/add-doctors", data);
  return res.data;
};

export const getDepartmentsByHospital = async (hospitalId) => {
  const res = await serverAxios.get(`/departments/hospital/${hospitalId}`);
  return res.data;
};

export const getDepartmentById = async (id) => {
  const res = await serverAxios.get(`/departments/${id}`);
  return res.data;
};

// ──── Appointment APIs ─────────────────────────────────────
export const bookAppointment = async (data) => {
  const res = await serverAxios.post("/appointments/book", data);
  return res.data;
};

export const getPatientAppointments = async (patientId) => {
  const res = await serverAxios.get(`/appointments/patient/${patientId}`);
  return res.data;
};

export const getDoctorAppointments = async (doctorId) => {
  const res = await serverAxios.get(`/appointments/doctor/${doctorId}`);
  return res.data;
};

export const updateAppointmentStatus = async (id, data) => {
  const res = await serverAxios.patch(`/appointments/status/${id}`, data);
  return res.data;
};

// ──── Medical File APIs ────────────────────────────────────
export const createMedicalFile = async (data) => {
  const res = await serverAxios.post("/medical-files/create", data);
  return res.data;
};

export const getMedicalFileById = async (id) => {
  const res = await serverAxios.get(`/medical-files/${id}`);
  return res.data;
};

// ──── Patient Record APIs ──────────────────────────────────
export const createPatientRecord = async (data) => {
  const res = await serverAxios.post("/patient-records/create", data);
  return res.data;
};

export const getPatientRecordById = async (id) => {
  const res = await serverAxios.get(`/patient-records/${id}`);
  return res.data;
};

// ──── Schedule APIs ────────────────────────────────────────
export const createDoctorSchedule = async (data) => {
  const res = await serverAxios.post("/schedules/create", data);
  return res.data;
};

export const getDoctorSchedule = async (doctorId) => {
  const res = await serverAxios.get(`/schedules/doctor/${doctorId}`);
  return res.data;
};

// ──── Review APIs ──────────────────────────────────────────
export const createReview = async (data) => {
  const res = await serverAxios.post("/reviews/create", data);
  return res.data;
};

export const getReviewsByDoctor = async (doctorId) => {
  const res = await serverAxios.get(`/reviews/doctor/${doctorId}`);
  return res.data;
};

export const getReviewsByHospital = async (hospitalId) => {
  const res = await serverAxios.get(`/reviews/hospital/${hospitalId}`);
  return res.data;
};