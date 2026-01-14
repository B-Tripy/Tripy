import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import socket from "../socket";
const API_URL = import.meta.env.VITE_API_URL || "/api";

// 공통 인스턴스 설정
// axios.defaults.baseURL = "http://192.168.45.200:5000";
// axios.defaults.withCredentials = true; // 쿠키 전송 허용 필수!
const instance = axios.create({
  withCredentials: true, // 모든 요청에 쿠키 포함
});

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      isChecking: true,

      // 새로고침 시 세션 검증: 백엔드 /users/me 구조에 맞춤
      checkAuth: async () => {
        try {
          set({ isChecking: true });
          const res = await instance.get(`${API_URL}/users/me`);
          // 백엔드 응답: { success: true, user: { id, username } }
          if (res.data.success) {
            set({ user: res.data.user, isChecking: false });
          }
        } catch (e) {
          // 401 에러 등이 나면 세션이 만료된 것이므로 유저 정보 초기화
          console.error(e);
          set({ user: null, isChecking: false });
        }
      },

      login: async (email, password) => {
  set({ loading: true, error: null });
  try {
    const res = await instance.post(`${API_URL}/users/login`, {
      email,
      password,
    });

    // 🔍 로그인 API 응답 확인
    console.log("Login response:", res.data);

    // 로그인 응답에 user 객체가 있다고 가정
    set({ user: res.data.user, loading: false });
    socket.connect();
    return { success: true };
  } catch (e) {
    const msg = e?.response?.data?.error || "로그인에 실패했습니다.";
    set({ loading: false, error: String(msg) });
    return { success: false };
  }
},


      join: async (nickname, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await instance.post(`${API_URL}/users/join`, {
            nickname,
            email,
            password,
          });
          set({ user: res.data.user, loading: false });
          return { success: true };
        } catch (e) {
          const msg = e?.response?.data?.error || "회원가입에 실패했습니다.";
          set({ loading: false, error: String(msg) });
          return { success: false };
        }
      },

      logout: async () => {
        try {
          await instance.post(`${API_URL}/users/logout`);
        } catch (e) {
          console.error("로그아웃 실패:", e);
        } finally {
          // 성공 실패 여부와 상관없이 클라이언트 상태는 로그아웃 처리
          set({ user: null, error: null });
          localStorage.removeItem("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage", // 로컬스토리지 키
      partialize: (state) => ({ user: state.user }), // 유저 정보만 저장
    }
  )
);
