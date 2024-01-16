import styled from 'styled-components';
import Loader from './loader';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <Loader r={100} strokeWidth={10} />
    </Wrapper>
  );
}
