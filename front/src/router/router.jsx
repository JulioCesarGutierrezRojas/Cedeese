import {Routes, Route, useLocation} from "react-router";
import Login from "../modules/auth/views/Login";
import Sidebar from "../components/Sidebar.jsx";
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
                    <Route path="/inicio/" element={<AppView />} />,
                    <Route path="/inicio2/" element={<RapeView/>}/>,
                </Routes>
            </div>
        </>
    );
};

export default AppRouter;