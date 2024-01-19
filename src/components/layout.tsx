import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RiHome7Fill, RiFileList2Line } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { FaRegBell } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegBookmark, FaRegUser } from 'react-icons/fa';
import { CgMoreO } from 'react-icons/cg';
import { btnStyle } from '../routes/home';

const Wrapper = styled.div`
  max-width: 68%;
  min-height: 100vh;
  background: transparent;
  margin: 0 auto;

  display: grid;
  grid-template-columns:
    minmax(235px, 0.65fr) minmax(235px, 1.4fr)
    minmax(235px, 1fr);

  @media (max-width: 1260px) {
    max-width: 100%;
    padding: 0 0.3rem;
  }
`;

const Nav = styled.nav`
  padding-right: 3rem;
  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    li {
      a,
      button {
        background: transparent;
        width: fit-content;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--font-color);
        font-size: 2rem;
        padding: 0.6rem 1rem 0.6rem 0.5rem;
        border: none;
        border-radius: 2rem;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          background: var(--shadow-color);
        }

        h3 {
          font-size: 1.3rem;
          font-weight: 600;
        }
      }
    }
  }

  & > button {
    ${btnStyle}
    background: var(--accent-color);
    color: var(--font-color);
    font-size: 1.3rem;
    font-weight: 600;
    width: 100%;
    border-radius: 2rem;
    margin-top: 2rem;
  }
`;

const Main = styled.main`
  border-left-width: 1px;
  border-right-width: 1px;
  border-color: var(--shadow-d-color);
  border-style: solid;
`;

const Aside = styled.aside`
  padding-top: 1rem;
  padding-left: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem;
  background: var(--shadow-color);
  border-radius: 2rem;
  font-size: 1.2rem;
  border: 2px solid transparent;
  transition: 500ms;

  svg {
    filter: brightness(0.9);
    flex-shrink: 0;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    color: var(--font-color);
    caret-color: var(--shadow-color);
    overflow: hidden;
  }

  &:hover {
    background: var(--shadow-l-color);
  }

  &:focus-within {
    background: transparent;
    border: 2px solid var(--accent-color);
  }
`;

const Article = styled.article`
  background: var(--shadow-d-color);
  border-radius: 1.3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 1.3rem;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2rem;
  }

  button {
    ${btnStyle}
    background: var(--accent-color);
    color: var(--font-color);
    width: fit-content;
    padding: 0 1rem;
    font-size: 1rem;
  }
`;

export default function Layout() {
  const navigate = useNavigate();

  const onPost = () => {
    navigate('post');
  };
  return (
    <>
      <Wrapper>
        <Nav>
          <svg style={{ width: '150px', height: '100px' }}>
            <circle
              r={30}
              cx={30}
              cy={30}
              style={{ transform: 'translate(5px,5px)' }}
            />
          </svg>
          <ul>
            <li>
              <Link to={'/main'}>
                <RiHome7Fill /> <h3>홈</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <IoSearch /> <h3>탐색하기</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <FaRegBell /> <h3>알림</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <MdOutlineEmail /> <h3>쪽지</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <RiFileList2Line /> <h3>리스트</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <FaRegBookmark /> <h3>북마크</h3>
              </Link>
            </li>
            <li>
              <Link to={''}>
                <RiHome7Fill /> <h3>Premium</h3>
              </Link>
            </li>
            <li>
              <Link to={'/main/profile'}>
                <FaRegUser /> <h3>프로필</h3>
              </Link>
            </li>
            <li>
              <button>
                <CgMoreO /> <h3>더 보기</h3>
              </button>
            </li>
          </ul>
          <button onClick={onPost}>게시하기</button>
        </Nav>
        <Main>
          <Outlet />
        </Main>
        <Aside>
          <SearchBox>
            <IoSearch />
            <input type='text' placeholder='검색'></input>
          </SearchBox>
          <Article>
            <h3>Premium 구독하기</h3>
            <p>
              구독하여 새로운 기능을 이용해 보세요. 자격을 충족하는 경우 광고
              수익 배분금도 받을 수 있습니다.
            </p>
            <button>게시하기</button>
          </Article>
          <Article>
            <h3>나를 위한 트렌드</h3>
          </Article>
          <Article>
            <h3>팔로우 추천</h3>
          </Article>
        </Aside>
      </Wrapper>
    </>
  );
}
