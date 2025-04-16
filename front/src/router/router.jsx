import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import Home from "../modules/master/views/Home";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;