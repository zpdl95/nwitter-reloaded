import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../api/firebase';

export default function GoogleBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await loginWithGoogle();
      navigate('/main');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button data-icon onClick={onClick}>
      <img
        src='https://cdn-icons-png.flaticon.com/512/2875/2875404.png'
        width='20'
        height='20'
      />
      Google 계정으로 가입하기
    </button>
  );
}
