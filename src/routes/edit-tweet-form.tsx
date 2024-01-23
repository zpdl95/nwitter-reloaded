import styled from 'styled-components';
import { Avatar, Loader } from '../components';
import { btnStyle } from './home';
import { AiOutlinePicture } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  addOrUpdatePhotoToTweet,
  deleteFile,
  fileUpload,
  getFileURL,
  updateTweet,
} from '../api/firebase';
import { useAuthContext } from '../context/auth-context';
import { ITweet } from '../components/timeline';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const Form = styled.form`
  background: var(--main-color);
  display: flex;
  flex-direction: column;
  width: max(450px, 30%);
  margin: 5rem auto 0;
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }
`;

const FormHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 0.5rem;

  h1 {
    font-weight: 600;
    font-size: 1.3rem;
  }

  button {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    color: var(--font-color);
    cursor: pointer;
  }
`;

const FormBody = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;

  div {
    display: flex;
    align-items: start;
    gap: 1rem;

    select {
      background: transparent;
      border: 1px solid var(--shadow-d-color);
      border-radius: 1rem;
      padding: 0.1rem 0.3rem;
      outline: none;
      color: var(--accent-color);
      font-size: 1rem;
    }
  }

  textarea {
    outline: none;
    border: none;
    padding-left: 3rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.2rem;
    color: var(--font-color);
    background: transparent;
    height: auto;
    max-height: 200px;
    resize: none;
    caret-color: var(--shadow-color);

    &::placeholder {
      font-weight: 600;
      color: var(--shadow-color);
      word-spacing: 0.1rem;
    }
  }

  figure {
    position: relative;
    border-radius: 1.5rem;
    overflow: hidden;
    margin-left: 3rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 24rem;

    img {
      object-fit: cover;
    }

    button {
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.5rem;
      width: 2rem;
      height: 2rem;
      background: black;
      color: var(--font-color);
      font-size: 1rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

const FormFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  section {
    label {
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      color: var(--accent-color);
      font-size: 1.5rem;
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

export default function EditTweetForm() {
  const { state }: { state: ITweet } = useLocation();
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState(state.tweet);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState(state.photo);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    console.log(file);

    if (!files || files.length !== 1) return;
    if (files[0].size > 1048576) {
      alert('❗ 파일 용량이 1MB를 초과합니다. ❗');
      e.target.value = '';
      return;
    }
    setFile(files[0]);
    setFileURL(URL.createObjectURL(files[0]));
    e.target.value = '';
  };

  const onClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    const target = e.target as HTMLDivElement | HTMLButtonElement;
    if (target.matches('.close')) {
      navigate(-1);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || isLoading || tweet === '' || tweet.length > 180 || !state.id)
      return;

    try {
      setLoading(true);
      await updateTweet({
        tweetId: state.id,
        tweet,
        createdAt: Date.now(),
      });

      if (!fileURL) {
        await addOrUpdatePhotoToTweet({ id: state.id, url: '' });
        await deleteFile({ userId: state.userId, id: state.id });
      }

      if (file) {
        const result = await fileUpload({
          docId: state.id,
          file,
          userId: state.userId,
          username: state.username,
        });
        const url = await getFileURL(result.ref);
        await addOrUpdatePhotoToTweet({ id: state.id, url });
      }

      navigate(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onImgDelete = async () => {
    setFile(null);
    setFileURL(undefined);
  };

  return (
    <Wrapper className='close' onClick={onClose}>
      <Form onSubmit={onSubmit}>
        <FormHeader>
          <h1>트윗 수정</h1>
          <button type='button' className='close'>
            &#10006;
          </button>
        </FormHeader>
        <FormBody>
          <div>
            <Avatar
              name={user?.displayName?.slice(0, 1) ?? 'A'}
              src={user?.photoURL}
            />
            <select>
              <option value='all'>모든사람</option>
            </select>
          </div>
          <textarea
            required
            rows={3}
            maxLength={180}
            placeholder='무슨 일이 일어나고 있나요?'
            value={tweet}
            onInput={onInput}
            onChange={onChange}
          />
          {fileURL && (
            <figure>
              <img src={fileURL} />
              <button type='button' onClick={onImgDelete}>
                &#10006;
              </button>
            </figure>
          )}
        </FormBody>
        <hr />
        <FormFooter>
          <section>
            <label>
              <AiOutlinePicture />
              <input
                type='file'
                name='file'
                accept='image/*'
                onChange={onFileChange}
              />
            </label>
          </section>
          <button disabled={isLoading}>업데이트</button>
        </FormFooter>
        {isLoading && <Loader />}
      </Form>
    </Wrapper>
  );
}
