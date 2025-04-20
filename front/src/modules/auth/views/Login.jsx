import FormLogin from "../components/FormLogin.jsx";
import Loader from '../../../components/Loader';

const Login = () => {
    return (
        <>
            <Loader isLoading={false} />
            <FormLogin />
        </>
    )
}

export default Login;
