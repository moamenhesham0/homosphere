import { useSearchParams } from 'react-router-dom';
import { AUTH_ARGS } from '@constants/routes';
const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get(AUTH_ARGS.REDIRECT_TO);

    return (
        <div>
            <p>Authentication Completed</p>
            <a href={`${window.location.origin}${redirectTo}`}>{`${window.location.origin}${redirectTo}`}</a>
        </div>
    );
}
export default AuthPage;