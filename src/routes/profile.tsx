import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { btnStyle } from './home';
import { CiEdit } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';
import { IoCalendarSharp } from 'react-icons/io5';
import { useAuthContext } from '../context/auth-context';
import {
  avatarUpload,
  bgUpload,
  fetchMyTweets,
  getBGURL,
  getFileURL,
  updateTweet,
  updateUserProfile,
} from '../api/firebase';
import React, { useEffect, useRef, useState } from 'react';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';
import { Avatar, Loader } from '../components';
import Logo from '../../public/z-icon.svg?react';

const Header = styled.header`
  background: transparent;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--shadow-d-color);

  div:first-of-type {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.3rem;

    svg {
      font-size: 2rem;
      cursor: pointer;
      border-radius: 50%;
      padding: 0.3rem;

      &:hover {
        background: var(--shadow-d-color);
      }
    }
  }

  div:last-of-type {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    p {
      font-size: 0.8rem;
      color: var(--shadow-d-color);
    }
  }
`;

const Article = styled.article`
  height: 30rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--shadow-d-color);

  & > section:first-of-type {
    flex: 1;
  }

  & > section:last-of-type {
    flex: 1.3;
  }
`;

const BGSection = styled.section<{ bg: string | null }>`
  background: ${(props) =>
    props.bg ? `url(${props.bg})` : `var(--shadow-d-color)`};
  background-position: center;
  background-size: cover;
`;

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: transparent;

  header {
    display: flex;
    justify-content: flex-end;
    position: relative;

    & > figure {
      position: absolute;
      left: 0;
      transform: translate(0, -50%);

      width: 25%;
      aspect-ratio: 1/1;
      margin-left: 1.5rem;
      border-radius: 50%;
      border: 5px solid var(--main-color);
      overflow: hidden;
      background: violet;

      display: flex;
      justify-content: center;
      align-items: center;

      label {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        input {
          display: none;
        }
      }
    }

    & > div {
      & > button {
        ${btnStyle}
        background: transparent;
        border: 1px solid var(--shadow-d-color);

        color: var(--font-color);
        font-size: 1rem;

        margin: 0.5rem 1rem;
      }
    }
  }
`;

const ProfileSectionMain = styled.main`
  padding: 0 1rem;
  font-size: 0.9rem;
  color: var(--shadow-d-color);

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > section:first-of-type {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    & > div {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--font-color);
      }

      & > div {
        position: relative;
        & > button {
          background: transparent;
          border: none;
          border-radius: 50%;
          color: var(--accent-color);
          font-size: 1.5rem;
          cursor: pointer;

          display: flex;
          align-items: center;
          position: relative;

          &:hover {
            background: var(--accent-color-50);
          }
        }
      }
    }
  }

  & > section:nth-of-type(2) {
    p {
      display: flex;
      gap: 0.5rem;
      font-weight: 600;
    }
  }

  & > section:last-of-type {
    display: flex;
    gap: 1rem;

    span {
      color: var(--font-color);
      font-weight: 600;
    }
  }
`;

const ProfileUl = styled.ul`
  flex-grow: 1;
  display: flex;

  li {
    flex: 1;
    display: flex;

    &:hover {
      background: var(--shadow-d-color-30);
    }

    a {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      color: var(--shadow-d-color);
      font-size: 0.9rem;
      font-weight: 600;

      div {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;

        div {
          position: absolute;
          bottom: 0.1rem;
          background: var(--accent-color);
          width: 100%;
          height: 0.2rem;
          border-radius: 1rem;
        }
      }
    }
  }
`;

const Ul = styled.ul`
  & > div {
    display: flex;
    justify-content: center;
    margin-top: 10%;
  }
`;

const NameEditDialog = styled.dialog`
  left: 0;
  top: 0;

  cursor: auto;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--main-color);

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input {
      outline: none;
      border: none;
      font-size: 1rem;
      color: var(--font-color);
      background: var(--shadow-color);
      padding: 0.3rem;
    }

    div {
      display: flex;
      justify-content: flex-end;
      gap: 0.1rem;

      button {
        ${btnStyle}

        &[value='confirm'] {
          background: var(--accent-color);
        }
      }
    }
  }
`;

const ImageEditDialog = styled.dialog`
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0);
      display: none;
    }
    100% {
      opacity: 1;
      transform: scale(1);
      display: block;
    }
  }
  @keyframes fade-out {
    0% {
      opacity: 1;
      transform: scale(1);
      display: block;
    }
    100% {
      opacity: 0;
      transform: scale(0);
      display: none;
    }
  }

  width: max(450px, 30%);
  height: 70%;
  border-radius: 0.5rem;
  background: var(--main-color);
  border: none;
  margin: auto;

  z-index: 10;

  /* animation: fade-out 0.3s ease-in-out; */

  &[open] {
    /* animation: fade-in 0.3s ease-in-out; */
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);

    /* animation: backdrop-fade-in 0.3s ease-in-out forwards; */

    @keyframes backdrop-fade-in {
      0% {
        background: rgba(0, 0, 0, 0);
      }
      100% {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }

  & > form {
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;

    & > header {
      display: flex;
      flex-direction: column;

      svg {
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 auto 1.5rem;
      }

      h2 {
        font-size: 2.2rem;
        font-weight: 600;
        color: var(--font-color);
        margin-left: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin-left: 3rem;
        color: var(--shadow-d-color);
        font-weight: 600;
      }

      button {
        border: none;
        outline: none;
        background: transparent;
        color: var(--font-color);
        font-size: 1.2rem;
        cursor: pointer;

        position: absolute;
        right: 0;
        top: 0;
      }
    }

    & > footer {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: 0 10%;
      gap: 0.5rem;

      button,
      label {
        ${btnStyle}
        padding:1rem;
        flex: 1;
        background: var(--main-color);
        border: 1px solid var(--shadow-d-color);
        color: var(--font-color);
        font-size: 1rem;

        &[value='confirm'] {
          background: var(--accent-color);
          color: black;
          border-color: transparent;
        }
        &[value='close'] {
          background: var(--shadow-color);
          border-color: transparent;
        }
      }

      label {
        display: flex;
        justify-content: center;
        align-items: center;

        input {
          display: none;
        }
      }

      & > div {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
`;

const ImageEditDialogFig = styled.figure<{ bg: string | null }>`
  background: ${(props) =>
    props.bg ? `url(${props.bg})` : `var(--shadow-d-color)`};
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  margin-bottom: 2rem;

  & > div {
    width: 35%;
    aspect-ratio: 1/1;
    border: 2px solid var(--font-color);
    border-radius: 50%;
  }
`;

export default function Profile() {
  const { user } = useAuthContext();
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [userBG, setUserBG] = useState<string | null>('');
  const [username, setUsername] = useState(user?.displayName);
  const [changename, setChangename] = useState(username);
  const [myTweets, setMyTweets] = useState<ITweet[]>();
  const [isLoading, setLoading] = useState(true);
  const namedialogRef = useRef<HTMLDialogElement>(null);
  const imagedialogRef = useRef<HTMLDialogElement>(null);
  const [dialogAvatar, setDialogAvatar] = useState(avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dialogBG, setDialogBG] = useState<string | null>(null);
  const [bgFile, setBGFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(user?.photoURL);
    setUsername(user?.displayName);
    fetchMyTweets({
      userId: user?.uid,
      callback1: setMyTweets,
      callback2: setLoading,
    });
    getBGURL({
      userId: user?.uid,
      callback: setUserBG,
    });
  }, [user]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && user) {
      const file = files[0];
      const result = await avatarUpload({ userId: user.uid, file });
      const avatarURL = await getFileURL(result.ref);
      await updateUserProfile(undefined, avatarURL);
      myTweets?.forEach(async (tweet) => {
        if (!tweet.tweetId) return;
        await updateTweet({ tweetId: tweet.tweetId, avatar: avatarURL });
      });
      setAvatar(avatarURL);
    }
  };

  const onNameEditClick = () => {
    setChangename(username);
    namedialogRef.current?.show();
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setChangename(value);
  };

  const onNameEditClose = async () => {
    if (namedialogRef.current?.returnValue === 'close') {
      console.log('close');
    } else {
      if (!changename) return;
      if (username === changename) return;
      if (confirm(`정말 ${changename}으로 바꾸시겠습니까?`)) {
        await updateUserProfile(changename);
        myTweets?.forEach(async (tweet) => {
          if (!tweet.tweetId) return;
          await updateTweet({ tweetId: tweet.tweetId, username: changename });
        });
        setUsername(changename);
      }
    }
  };

  const onImgEditClick = () => {
    imagedialogRef.current?.showModal();
  };

  const onImgEditCloseClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLDialogElement;
    if (target.nodeName === 'DIALOG') {
      imagedialogRef.current?.close('close');
    }
  };

  const onImgEditClose = async () => {
    if (imagedialogRef.current?.returnValue === 'close') {
      setDialogAvatar(null);
      setAvatarFile(null);
      setDialogBG(null);
      setBGFile(null);
    } else {
      if (avatarFile && user) {
        const result = await avatarUpload({
          userId: user.uid,
          file: avatarFile,
        });
        const avatarURL = await getFileURL(result.ref);
        await updateUserProfile(undefined, avatarURL);
        myTweets?.forEach(async (tweet) => {
          if (!tweet.tweetId) return;
          await updateTweet({ tweetId: tweet.tweetId, avatar: avatarURL });
        });
        setAvatar(avatarURL);
      }
      if (bgFile && user) {
        const result = await bgUpload({
          userId: user.uid,
          file: bgFile,
        });
        const bgURL = await getFileURL(result.ref);
        setUserBG(bgURL);
      }
    }
  };

  const onDialogAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setDialogAvatar(fileURL);
      setAvatarFile(file);
    }
  };

  const onDialogBGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setDialogBG(fileURL);
      setBGFile(file);
    }
  };

  const onToBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header>
        <div onClick={onToBack}>
          <FaArrowLeft />
        </div>
        <div>
          <h3>{username ?? 'Anonymous'}</h3>
          <p>{myTweets?.length} 게시물</p>
        </div>
      </Header>
      <Article>
        <BGSection bg={userBG}></BGSection>
        <ProfileSection>
          <header>
            <figure>
              <label>
                <Avatar
                  name={username?.slice(0, 1) ?? 'Anonymous'}
                  src={avatar}
                />
                <input type='file' accept='image/*' onChange={onAvatarChange} />
              </label>
            </figure>
            <div>
              <button onClick={onImgEditClick}>프로필 설정하기</button>
              <ImageEditDialog
                ref={imagedialogRef}
                onClick={onImgEditCloseClick}
                onClose={onImgEditClose}
              >
                <form method='dialog'>
                  <header>
                    <Logo />
                    <h2>사진 선택하기</h2>
                    <h3>
                      마음에 드는 셀카, 사진이 있나요? 지금 업로드 하세요.
                    </h3>
                    <button value={'close'}>&#10006;</button>
                  </header>
                  <ImageEditDialogFig bg={dialogBG || userBG}>
                    <div>
                      <Avatar
                        name={username?.slice(0, 1) ?? 'Anonymous'}
                        src={dialogAvatar || avatar}
                      />
                    </div>
                  </ImageEditDialogFig>
                  <footer>
                    <label>
                      프로필 사진 선택하기
                      <input
                        type='file'
                        accept='image/*'
                        onChange={onDialogAvatarChange}
                      />
                    </label>
                    <label>
                      배경 이미지 선택하기
                      <input
                        type='file'
                        accept='image/*'
                        onChange={onDialogBGChange}
                      />
                    </label>
                    <div>
                      <button value={'close'}>지금은 넘어가기</button>
                      <button value={'confirm'}>변경하기</button>
                    </div>
                  </footer>
                </form>
              </ImageEditDialog>
            </div>
          </header>
          <ProfileSectionMain>
            <section>
              <div>
                <h3>{username ?? 'Anonymous'}</h3>
                <div>
                  <button onClick={onNameEditClick}>
                    <CiEdit />
                  </button>
                  <NameEditDialog ref={namedialogRef} onClose={onNameEditClose}>
                    <form method='dialog'>
                      <input
                        type='text'
                        value={changename ?? ''}
                        onChange={onNameChange}
                      />
                      <div>
                        <button value='close'>취소</button>
                        <button value='confirm'>변경</button>
                      </div>
                    </form>
                  </NameEditDialog>
                </div>
              </div>
              <p>@{user ? user.uid.slice(0, 8) : '00000000'}</p>
            </section>
            <section>
              <p>
                <IoCalendarSharp />
                {user?.metadata.creationTime &&
                  `가입일: ${new Date(
                    user?.metadata.creationTime
                  ).getFullYear()}년 ${
                    new Date(user?.metadata.creationTime).getMonth() + 1
                  }월 ${new Date(user?.metadata.creationTime).getDate()}일`}
              </p>
            </section>
            <section>
              <p>
                <span>0</span> 팔로우 중
              </p>
              <p>
                <span>0</span> 팔로워
              </p>
            </section>
          </ProfileSectionMain>
          <ProfileUl>
            <li>
              <Link to={''}>
                <div>
                  <h3>게시물</h3>
                  <div></div>
                </div>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <div>
                  <h3>답글</h3>
                  {/* <div></div> */}
                </div>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <div>
                  <h3>하이라이트</h3>
                  {/* <div></div> */}
                </div>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <div>
                  <h3>미디어</h3>
                  {/* <div></div> */}
                </div>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <div>
                  <h3>마음에 들어요</h3>
                  {/* <div></div> */}
                </div>
              </Link>
            </li>
          </ProfileUl>
        </ProfileSection>
      </Article>
      <Ul>
        {!isLoading ? (
          myTweets?.map((tweet) => <Tweet key={tweet.tweetId} {...tweet} />)
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </Ul>
      <Outlet />
    </>
  );
}
