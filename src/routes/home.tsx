import { Outlet, useNavigate } from 'react-router-dom';
import { css, styled } from 'styled-components';
import { GithubBtn, GoogleBtn } from '../components';
import Logo from '../../public/z-icon.svg?react';

// eslint-disable-next-line react-refresh/only-export-components
export const btnStyle = css`
  outline: none;
  border: none;
  border-radius: 1rem;
  background-color: var(--font-color);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: 500ms;

  &:hover {
    filter: brightness(0.8);
  }
`;

const Main = styled.main`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const LogoFig = styled.figure`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: var(--font-color);
  }
`;

const Section = styled.section`
  margin-top: 180px;

  h1 {
    font-size: 4rem;
    line-height: 5rem;
    font-weight: 600;
    word-spacing: -0.3rem;
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 17rem;

    &:first-of-type {
      margin-bottom: 3.5rem;

      button:last-of-type {
        background-color: var(--accent-color);
        color: var(--font-color);
      }
    }

    button {
      ${btnStyle}

      &[data-icon] {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }
    }

    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      hr {
        flex: 1;
        border: none;
        height: 1px;
        background-color: var(--font-color);
      }
    }

    p {
      font-size: 0.6rem;
      span {
        color: var(--accent-color);
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const Footer = styled.footer``;

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Main>
        <LogoFig>
          <Logo />
        </LogoFig>
        <Section>
          <h1>지금 일어나고 있는 일</h1>
          <h2>지금 가입하세요</h2>
          <section>
            <GoogleBtn />
            <GithubBtn />
            <div>
              <hr />
              <span>or</span>
              <hr />
            </div>
            <button
              onClick={() => {
                navigate('/signup');
              }}
            >
              계정 만들기
            </button>
            <p>
              가입하시려면 <span>쿠키 사용</span>을 포함해 <span>이용약관</span>
              과 <span>개인정보 처리방침</span>에 동의해야 합니다.
            </p>
          </section>
          <section>
            <h3>이미 트위터에 가입하셨나요?</h3>
            <button
              onClick={() => {
                navigate('/login');
              }}
            >
              로그인
            </button>
          </section>
        </Section>
      </Main>
      <Footer></Footer>
      <Outlet />
    </>
  );
}
