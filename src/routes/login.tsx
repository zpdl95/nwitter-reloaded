import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { btnStyle } from './home';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { loginWithEmailAndPassword } from '../api/firebase';
import { GithubBtn, GoogleBtn, Loader, ResetPasswordBtn } from '../components';
import Logo from '../../public/z-icon.svg?react';

const inputStyle = css`
  background-color: inherit;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: solid 1px var(--font-color);
  border-radius: 0.3rem;
  outline: none;
  color: inherit;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  background-color: var(--main-color);
  border-radius: 0.3rem;
  padding: 1.7rem 3.5rem;
  width: 450px;
  color: var(--font-color);

  header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.8rem;
      font-weight: 600;

      display: flex;
      align-items: center;

      svg {
        width: 2rem;
        height: 2rem;
      }
    }

    button {
      outline: none;
      background: none;
      border: none;
      font-size: 1.2rem;
      color: inherit;
      cursor: pointer;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  section {
    align-self: stretch;
    display: flex;
    flex-direction: column;

    input {
      ${inputStyle}

      &:focus {
        border-color: var(--accent-color);
      }
    }
  }
  section:first-of-type {
    gap: 1rem;
    p {
      color: red;
      padding: 0.5rem;
      font-size: 0.7rem;
    }
  }
  section:last-of-type {
    div {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      hr {
        flex: 1;
        border: none;
        height: 1px;
        background-color: var(--font-color);
      }
    }

    button {
      ${btnStyle}
      margin:.2rem 0;

      &:nth-of-type(3) {
        background-color: var(--accent-color);
      }

      &:last-of-type {
        opacity: 0.3;
        border: 1px solid var(--accent-color);
        background-color: transparent;

        &:hover {
          opacity: 1;
          border: 1px solid transparent;
          background-color: var(--font-color);
        }
      }

      &[disabled] {
        cursor: not-allowed;
      }

      &[data-icon] {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }
    }

    p {
      font-size: 0.7rem;
      margin-top: 0.3rem;
      color: red;
      text-align: center;
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'email') {
      setFormData((prev) => ({ ...prev, email: value }));
    } else if (name === 'password') {
      setFormData((prev) => ({ ...prev, password: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      // create account
      // set the name of the user
      // redirect to the main page

      await loginWithEmailAndPassword(formData.email, formData.password);

      navigate('/main', {
        replace: true,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.matches('.close')) {
      navigate(-1);
    }
  };

  return (
    <Wrapper className='close' onClick={onClick}>
      <Article>
        <header>
          <h1>
            <Logo />에 로그인 하세요
          </h1>
          <button className='close'>&#10006;</button>
        </header>
        <Form onSubmit={onSubmit}>
          <section>
            <input
              type='email'
              name='email'
              placeholder='이메일'
              required
              value={formData.email}
              onChange={onChange}
            />
            <input
              type='password'
              name='password'
              placeholder='비밀번호'
              required
              minLength={8}
              maxLength={20}
              value={formData.password}
              onChange={onChange}
            />
          </section>
          <Loader r={7} strokeWidth={2} visible={isLoading} />
          <section>
            <GoogleBtn />
            <GithubBtn />
            <div>
              <hr />
              or
              <hr />
            </div>
            <button>로그인하기</button>
            <ResetPasswordBtn />
            <p style={{ visibility: error ? 'visible' : 'hidden' }}>{error}</p>
          </section>
        </Form>
      </Article>
    </Wrapper>
  );
}
