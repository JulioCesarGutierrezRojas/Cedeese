import FormLogin from "../components/FormLogin.jsx";
import Loader from '../../../components/Loader';
import ErrorBoundary from '../../../components/ErrorBoundary';

const Login = () => {
    return (
        <>
            <ErrorBoundary>
                <Loader isLoading={false} />
            </ErrorBoundary>
            <FormLogin />
        </>
    )
}

export default Login;
