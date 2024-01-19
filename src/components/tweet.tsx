import styled from 'styled-components';
import { ITweet } from './timeline';
import { Avatar } from '.';
import { HiShieldCheck } from 'react-icons/hi2';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import React, { useState } from 'react';
import { useAuthContext } from '../context/auth-context';
import { deleteFile, deleteTweet } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

const List = styled.li`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px;
  border-style: solid;
  border-color: var(--shadow-d-color);
  border-collapse: collapse;
`;

const ListSection = styled.section`
  flex: 1;

  header {
    display: flex;
    justify-content: space-between;

    div:first-of-type {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      h3 {
        font-weight: 600;
        font-size: 1.1rem;
      }

      svg {
        color: var(--accent-color);
        font-size: 1.1rem;
      }

      span {
        color: var(--shadow-d-color);
        font-size: 0.9rem;
      }
    }

    div:last-of-type {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;
      position: relative;

      ul {
        position: absolute;
        top: 0;
        right: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        word-break: keep-all;
        background: var(--main-color);
        border: 1px solid var(--shadow-d-color);
        border-radius: 0.5rem;
        padding: 0.5rem;

        li {
          padding: 0.1rem;
          border-radius: 0.1rem;

          &:hover {
            background: var(--shadow-color);
          }
        }
      }

      &:hover {
        background: var(--accent-color);
      }
    }
  }

  p {
    color: var(--font-color);
    padding: 1rem 0.3rem;
  }
`;

export default function Tweet({
  username,
  userId,
  tweet,
  createdAt,
  photo,
  id,
}: ITweet) {
  const [isOpenOption, setOpenOption] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const onOpenOption = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.closest('.option')) {
      setOpenOption((prev) => !prev);
    }
  };

  const onClick = async (e: React.MouseEvent<HTMLUListElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLUListElement;

    if (target.matches('.delete') && user?.uid === userId) {
      try {
        await deleteTweet(id);
        if (photo) {
          await deleteFile({ userId: user.uid, id });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOpenOption((prev) => !prev);
      }
    } else if (target.matches('.edit') && user?.uid === userId) {
      navigate('edit', {
        state: {
          username,
          userId,
          tweet,
          createdAt,
          photo,
          id,
        },
      });
      setOpenOption((prev) => !prev);
    }
  };
  return (
    <List>
      <figure>
        <Avatar name={username[0]} />
      </figure>
      <ListSection>
        <header>
          <div>
            <h3>{username}</h3>
            <HiShieldCheck />
            <span>{userId.slice(0, 10)}</span>
            <span>·</span>
            <span>
              {new Date(createdAt.seconds).getMonth() + 1}월
              {new Date(createdAt.seconds).getDate() - 1}일
            </span>
          </div>
          {user?.uid === userId && (
            <div className='option' onClick={onOpenOption}>
              <HiOutlineDotsHorizontal />
              {isOpenOption && (
                <ul onClick={onClick}>
                  <li className='edit'>수정하기</li>
                  <li className='delete'>삭제하기</li>
                </ul>
              )}
            </div>
          )}
        </header>
        <p>{tweet}</p>
        {photo && (
          <figure>
            <img src={photo} />
          </figure>
        )}
        <footer></footer>
      </ListSection>
    </List>
  );
}
