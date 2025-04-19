import {Routes, Route, useLocation} from "react-router";
import Login from "../modules/auth/views/Login";
import Sidebar from "../components/Sidebar.jsx";
import Home from "../modules/master/views/Home.jsx"
import Customers from "../modules/master/views/Customers.jsx";
import Task from "../modules/master/views/Task.jsx";

const AppRouter = () => {
    const location = useLocation();
    const role = localStorage.getItem("role")

    return (
        <>
            { location.pathname !== '/' && <Sidebar role={role}/>}
            <div className={ location.pathname !== '/' ? 'content-area' : '' }>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/tasks" element={<Task />} />
                </Routes>
            </div>
        </>
    );
};

export default AppRouter;