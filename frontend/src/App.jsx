/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Main";
import Plan from "./pages/Plan";
import Recommend from "./pages/Recommend";
import Album from "./pages/Album";
import Theme from "./pages/Theme";
import Review from "./pages/Review";
import Loading from "./components/Loading";
import ReviewDetail from "./pages/Review/ReviewDetail"; // 리뷰상세 페이지 컴포넌트
import AI from "./pages/AI";
import "./App.css";
import { ValueContext } from "./context/ValueContext";
import { Reset } from "./context/ValueContext";
function App() {
  const { user, isChecking, checkAuth } = useAuthStore();
  const [value, setValue] = useState({
    tripId: null,
    tripTitle: null,
    own: false,
  });
  const [reset, setReset] = useState(false);
  useEffect(() => {
    // 새로고침 하자마자 서버에 세션 유효성 확인
    checkAuth();
  }, []);
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          opcity: 0.2,
        }}
      >
        {/* <p>로그인 상태를 확인하고 있습니다...</p> */}
        <Loading />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <div className="App">
        <ValueContext.Provider value={{ value, setValue }}>
          <Reset.Provider value={{ reset, setReset }}>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/recommend" element={<Recommend />} />
                <Route path="/album" element={<Album />} />
                <Route path="/theme" element={<Theme />} />
                <Route path="/review" element={<Review />} />
                <Route path="/review/:id" element={<ReviewDetail />} />
                <Route path="/ai" element={<AI />} />
              </Routes>
            </main>
          </Reset.Provider>
        </ValueContext.Provider>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
