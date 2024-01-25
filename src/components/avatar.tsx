import styled from 'styled-components';

const Figure = styled.figure`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  background: var(--shadow-l-color);
  color: var(--shadow-d-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default function Avatar({
  name,
  src,
}: {
  name: string;
  src?: string | null;
}) {
  return <Figure>{src ? <img src={src} /> : <h4>{name}</h4>}</Figure>;
}
