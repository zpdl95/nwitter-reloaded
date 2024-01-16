import { useNavigate } from 'react-router-dom';
import { loginWithGithub } from '../api/firebase';

export default function GithubBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await loginWithGithub();
      navigate('/main');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button data-icon type='button' onClick={onClick}>
      <img
        src='https://cdn-icons-png.flaticon.com/512/733/733609.png '
        width='20'
        height='20'
      />
      Github에서 로그인
    </button>
  );
}
