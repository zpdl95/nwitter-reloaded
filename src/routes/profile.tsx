import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { btnStyle } from './home';
import { CiEdit } from 'react-icons/ci';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import { IoCalendarSharp } from 'react-icons/io5';
import { useAuthContext } from '../context/auth-context';
import {
  avatarUpload,
  fetchMyTweets,
  getFileURL,
  updateTweet,
  updateUserProfile,
} from '../api/firebase';
import React, { useEffect, useRef, useState } from 'react';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

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
    background: var(--shadow-d-color);
  }

  & > section:last-of-type {
    flex: 1.3;
    background: transparent;
  }
`;

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  header {
    display: flex;
    justify-content: flex-end;
    position: relative;

    figure {
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

        svg {
          font-size: 4vw;
        }

        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }

    & > button {
      ${btnStyle}
      background: transparent;
      border: 1px solid var(--shadow-d-color);

      color: var(--font-color);
      font-size: 1rem;

      margin: 0.5rem 1rem;
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
      position: relative;

      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--font-color);
      }

      & > button {
        background: transparent;
        border: none;
        border-radius: 50%;
        color: var(--accent-color);
        font-size: 1.5rem;
        cursor: pointer;

        display: flex;
        align-items: center;

        &:hover {
          background: var(--accent-color-50);
        }
      }

      dialog {
        left: 100px;
        top: 0;

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
      }
    }

    p {
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

export default function Profile() {
  const { user } = useAuthContext();
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [username, setUsername] = useState(user?.displayName);
  const [changename, setChangename] = useState(username);
  const [myTweets, setMyTweets] = useState<ITweet[]>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(user?.photoURL);
    setUsername(user?.displayName);
    fetchMyTweets({
      userId: user?.uid,
      callback: setMyTweets,
    });
  }, [user]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && user) {
      const file = files[0];
      const result = await avatarUpload({ userId: user.uid, file });
      const avatarURL = await getFileURL(result.ref);
      await updateUserProfile(undefined, avatarURL);
      setAvatar(avatarURL);
    }
  };

  const onNameEdit = () => {
    setChangename(username);
    dialogRef.current?.show();
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setChangename(value);
  };

  const onDialogClose = async () => {
    if (dialogRef.current?.returnValue === 'close') {
      console.log('close');
    } else {
      if (!changename) return;
      if (username === changename) return;
      if (confirm(`정말 ${changename}으로 바꾸시겠습니까?`)) {
        await updateUserProfile(changename);
        myTweets?.forEach(async (tweet) => {
          if (!tweet.id) return;
          await updateTweet({ tweetId: tweet.id, username: changename });
        });
        setUsername(changename);
      }
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
          <h3>{user?.displayName ?? 'Anonymous'}</h3>
          <p>{myTweets?.length} 게시물</p>
        </div>
      </Header>
      <Article>
        <section></section>
        <ProfileSection>
          <header>
            <figure>
              <label>
                {avatar ? <img src={avatar} /> : <FaUser />}
                <input type='file' accept='image/*' onChange={onAvatarChange} />
              </label>
            </figure>
            <button style={{ visibility: 'hidden' }}>프로필 설정하기</button>
          </header>
          <ProfileSectionMain>
            <section>
              <div>
                <h3>{user?.displayName ?? 'Anonymous'}</h3>
                <button onClick={onNameEdit}>
                  <CiEdit />
                </button>
                {username && (
                  <dialog ref={dialogRef} onClose={onDialogClose}>
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
                  </dialog>
                )}
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
      <ul>
        {myTweets?.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </ul>
    </>
  );
}
