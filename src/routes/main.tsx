import styled from 'styled-components';
import { btnStyle } from './home';
import { Avatar } from '../components';
import { AiOutlinePicture } from 'react-icons/ai';
import { Outlet, useNavigate } from 'react-router-dom';
import Timeline from '../components/timeline';
import { useAuthContext } from '../context/auth-context';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;

  h1 {
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.5rem;
  }

  & > div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;

    div {
      display: flex;
      justify-content: center;
      padding: 1rem 0;

      h2 {
        font-weight: 600;
      }

      &:hover {
        background: var(--shadow-d-color);
      }
    }
  }
`;

const Form = styled.form`
  border-top: 1px;
  border-bottom: 1px;
  border-color: var(--shadow-d-color);
  border-style: solid;
  padding: 0.5rem 1rem;
`;

const FormBody = styled.section`
  display: flex;
  align-items: center;

  textarea {
    flex: 1;
    outline: none;
    border: none;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.2rem;
    color: var(--font-color);
    background: transparent;
    height: auto;
    max-height: 200px;
    overflow: hidden;
    resize: none;
    caret-color: var(--shadow-color);

    &::placeholder {
      font-weight: 600;
      color: var(--shadow-color);
      word-spacing: 0.1rem;
    }
  }
`;

const FormFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 1rem;

  section {
    margin-left: calc(2.7rem + 1rem);
    display: flex;

    label {
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      color: var(--accent-color);
      font-size: 1.2rem;
      border-radius: 50%;
      padding: 0.3rem;
      cursor: pointer;

      &:hover {
        background: var(--shadow-d-color);
      }

      input {
        display: none;
      }
    }
  }

  button {
    ${btnStyle}
    background: var(--accent-color);
  }
`;

export default function Main() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.matches('.post') || target.closest('.post')) navigate('post');
  };
  return (
    <>
      <Header>
        <h1>홈</h1>
        <div>
          <div>
            <h2>추천</h2>
          </div>
          <div>
            <h2>팔로우 중</h2>
          </div>
        </div>
      </Header>
      <Form onClick={onClick}>
        <FormBody>
          <Avatar
            name={user?.displayName?.slice(0, 1) ?? 'A'}
            src={user?.photoURL}
          />
          <textarea
            rows={1}
            placeholder='무슨 일이 일어나고 있나요?'
            readOnly
            className='post'
          />
        </FormBody>
        <FormFooter>
          <section>
            <label className='post'>
              <AiOutlinePicture />
              <input type='file' name='file' />
            </label>
          </section>
          <button type='button' className='post'>
            게시하기
          </button>
        </FormFooter>
      </Form>
      <Timeline />
      <Outlet />
    </>
  );
}
