import {Routes, Route, useLocation} from "react-router";
import Login from "../modules/auth/views/Login";
import Sidebar from "../components/Sidebar.jsx";
import TaskRd from "../modules/rd/views/task_rd.jsx";
import TaskForm from "../modules/rd/views/create_task.jsx";
import AppView from "../modules/ap/views/ApView.jsx";
import RapeView from "../modules/rape/views/RapeView.jsx";

const AppRouter = () => {
    const location = useLocation();
    const role = localStorage.getItem("role")

    return (
        <>
            { location.pathname !== '/' && <Sidebar role={role}/>}
            <div className={ location.pathname !== '/' ? 'content-area' : '' }>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/rd" element={<><Sidebar role="RD"/><TaskRd /></>} />
                    <Route path="taskform" element={<><Sidebar role="RD"/><TaskForm /></>} />
                    <Route path="/inicio/" element={<AppView />} />,
                    <Route path="/inicio2/" element={<RapeView/>}/>,
                </Routes>
            </div>
        </>
    );
};

export default AppRouter;