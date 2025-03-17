import {Routes, Route, useLocation} from "react-router";
import Login from "../modules/auth/views/Login";
import Sidebar from "../components/Sidebar.jsx";

const AppRouter = () => {
    const location = useLocation();
    const role = localStorage.getItem("role")

    return (
        <>
            { location.pathname !== '/' && <Sidebar role={role}/>}
            <div className={ location.pathname !== '/' ? 'content-area' : '' }>
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </>
    );
};

export default AppRouter;