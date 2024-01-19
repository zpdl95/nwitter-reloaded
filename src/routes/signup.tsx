import styled, { css } from 'styled-components';
import { btnStyle } from './home';
import React, { useState } from 'react';
import { createAccount, updateUserProfile } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Loader } from '../components';

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
  width: 500px;
  color: var(--font-color);

  header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.8rem;
      font-weight: 600;
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
  gap: 1rem;

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
    p {
      color: red;
      padding: 0.5rem;
      font-size: 0.7rem;
    }
  }
  section:last-of-type {
    h2 {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.8rem;
      filter: brightness(0.5);
      margin-bottom: 0.8rem;

      &:last-of-type {
        color: red;
        filter: none;
      }
    }

    div {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 3.5rem;

      select {
        flex: 1;
        outline: none;
        ${inputStyle}

        &:focus {
          border-color: var(--accent-color);
        }

        option {
          background-color: var(--shadow-color);
        }
      }
    }

    button {
      ${btnStyle}
      background-color: var(--accent-color);
      width: 70%;
      align-self: center;

      &[disabled] {
        cursor: not-allowed;
      }
    }
  }
`;

const errors: { [key: string]: string } = {
  'auth/email-already-in-use': '이미 사용중인 이메일 입니다.',
};

const years = [1940, new Date().getFullYear()];
const months = [1, 12];
const dates = [1, 31];

const nameRegx =
  /^(?![_])[A-z0-9가-힣][A-z0-9가-힣-_ ]{1,6}(?![_])[A-z0-9가-힣]$/;
const emailRegx = /^[A-z0-9_-]{1,8}@[a-z0-9-_]{1,8}\.[a-z]{2,}$/;
const passwordRegx =
  /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[!@~])[A-z\d!@~]{8,20}/;

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formCheck, setFormCheck] = useState({
    name: true,
    email: true,
    password: true,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birth: {
      year: '',
      month: '',
      date: '',
    },
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'name') {
      setFormData((prev) => ({ ...prev, name: value }));
      setFormCheck((prev) => ({
        ...prev,
        name: nameRegx.test(value),
      }));
      if (value === '')
        setFormCheck((prev) => ({
          ...prev,
          name: true,
        }));
    } else if (name === 'email') {
      setFormData((prev) => ({ ...prev, email: value }));
      setFormCheck((prev) => ({
        ...prev,
        email: emailRegx.test(value),
      }));
      if (value === '')
        setFormCheck((prev) => ({
          ...prev,
          email: true,
        }));
    } else if (name === 'password') {
      setFormData((prev) => ({ ...prev, password: value }));
      setFormCheck((prev) => ({
        ...prev,
        password: passwordRegx.test(value),
      }));
      if (value === '')
        setFormCheck((prev) => ({
          ...prev,
          password: true,
        }));
    } else if (name === 'year') {
      setFormData((prev) => ({
        ...prev,
        birth: {
          ...prev.birth,
          year: value,
        },
      }));
    } else if (name === 'month') {
      setFormData((prev) => ({
        ...prev,
        birth: {
          ...prev.birth,
          month: value,
        },
      }));
    } else if (name === 'date') {
      setFormData((prev) => ({
        ...prev,
        birth: {
          ...prev.birth,
          date: value,
        },
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading) return;
    if (!formCheck.name || !formCheck.email || !formCheck.password) {
      setError('이름, 이메일, 비밀번호를 다시 확인하십시오.');
      return;
    }

    try {
      setLoading(true);
      // create account
      // set the name of the user
      // redirect to the main page
      await createAccount(formData.email, formData.password);
      await updateUserProfile(formData.name);
      navigate('/main', {
        replace: true,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(errors[error.code]);
      }
    } finally {
      setLoading(false);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    const target = e.target as HTMLDivElement | HTMLButtonElement;
    if (target.matches('.close')) {
      navigate(-1);
    }
  };

  return (
    <Wrapper className='close' onClick={onClick}>
      <Article>
        <header>
          <h1>계정을 생성하세요</h1>
          <button className='close'>&#10006;</button>
        </header>
        <Form onSubmit={onSubmit}>
          <section>
            <input
              type='text'
              name='name'
              placeholder='이름'
              required
              minLength={3}
              maxLength={8}
              value={formData.name}
              onChange={onChange}
            />
            <p
              id='name'
              style={{ visibility: formCheck.name ? 'hidden' : 'visible' }}
            >
              이름은 숫자, 영어, 한글 이여야 합니다. 처음과 끝에는 공백이
              들어가면 안됩니다.
            </p>
            <input
              type='email'
              name='email'
              placeholder='이메일'
              required
              value={formData.email}
              onChange={onChange}
            />
            <p
              id='email'
              style={{ visibility: formCheck.email ? 'hidden' : 'visible' }}
            >
              이메일 형식이 아닙니다.
            </p>
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
            <p
              id='password'
              style={{ visibility: formCheck.password ? 'hidden' : 'visible' }}
            >
              비밀번호는 특수문자, 영어대문자, 영어소문자, 숫자가 하나 이상
              있어야 합니다.
            </p>
          </section>
          <Loader r={7} strokeWidth={2} visible={isLoading} />
          <section>
            <h2>생년월일</h2>
            <p>
              이 정보는 공개적으로 표시되지 않습니다. 비즈니스, 반려동물 등
              계정주제에 상관없이 나의 연령을 확인하세요.
            </p>
            <div>
              <select
                name='year'
                value={formData.birth.year}
                onChange={onChange}
                required
              >
                <option value=''>년</option>
                {Array.from(
                  { length: years[1] - years[0] + 1 },
                  (_, i) => years[0] + i
                ).map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
              <select
                name='month'
                value={formData.birth.month}
                onChange={onChange}
                required
              >
                <option value=''>월</option>
                {Array.from(
                  { length: months[1] - months[0] + 1 },
                  (_, i) => months[0] + i
                ).map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
              <select
                name='date'
                value={formData.birth.date}
                onChange={onChange}
                required
              >
                <option value=''>일</option>
                {Array.from(
                  { length: dates[1] - dates[0] + 1 },
                  (_, i) => dates[0] + i
                ).map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
            </div>
            <p>{error}</p>
            <button disabled={isLoading}>생성하기</button>
          </section>
        </Form>
      </Article>
    </Wrapper>
  );
}
