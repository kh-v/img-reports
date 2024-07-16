import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const useRefreshToken = () => {
    const [cookies, setCookie] = useCookies(['jwt']);
    const {  auth, setUserAuth } = useAuth();
    const navigate = useNavigate();


    const refresh = async () => {
        try {
            const response = await axios.get(`/refresh?token=${cookies.jwt}`, {
                withCredentials: true,
            });
            console.log(response.data)
            setUserAuth({ ...auth, accessToken: response.data.accessToken });
            return response.data.accessToken;
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log('Unauthorized');
                navigate('/login')
            } 
        }
    }
    return refresh;
};

export default useRefreshToken;
