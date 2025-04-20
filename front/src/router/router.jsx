import {Routes, Route, useLocation} from "react-router";
import Login from "../modules/auth/views/Login";
import RecoverPassword from "../modules/auth/views/RecoverPassword";
import Sidebar from "../components/Sidebar.jsx";
import TaskRd from "../modules/rd/views/task_rd.jsx";
import TaskForm from "../modules/rd/views/create_task.jsx";
import RapeView from "../modules/rape/views/RapeView.jsx";
import ApView from "../modules/ap/views/ApView.jsx";
import Home from "../modules/master/views/Home.jsx";
import Customers from "../modules/master/views/Customers.jsx";
import Task from "../modules/master/views/Task.jsx";
import Fases from "../modules/master/views/Fases.jsx";

const AppRouter = () => {
    const location = useLocation();
    const role = localStorage.getItem("role")

    return (
        <>
            { location.pathname !== '/' && location.pathname !== '/recover-password' && <Sidebar role={role}/>}
            <div className={ location.pathname !== '/' && location.pathname !== '/recover-password' ? 'content-area' : '' }>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/recover-password" element={<RecoverPassword />} />
                    <Route path="/rd" element={<><Sidebar role="RD"/><TaskRd /></>} />
                    <Route path="taskform" element={<><Sidebar role="RD"/><TaskForm /></>} />
                    <Route path="/ap-user/" element={<ApView />} />
                    <Route path="/rape-user/" element={<RapeView/>}/>
                    
                    <Route path="/home" element={<Home/>}/>,
                    <Route path="/customers" element={<Customers/>}/>,
                    <Route path="/tasks" element={<Task/>}/>,
                </Routes>
            </div>
        </>
    );
};

export default AppRouter;
