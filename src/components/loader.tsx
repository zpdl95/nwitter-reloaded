import { keyframes, styled } from 'styled-components';

const animate = (circleLen) => keyframes`
  0%,100%
  {
    stroke-dashoffset: ${circleLen};
  }
  50%
  {
    stroke-dashoffset: 0;
  }
  50.1%
  {
      stroke-dashoffset: ${circleLen * 2} ;
  }
`;

const rotate = keyframes`
  0%
  {
    transform:rotate(0deg);
  }
  100%
  {
    transform:rotate(360deg);
  }  
`;

const SVG = styled.svg`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  animation: ${rotate} 2s linear infinite;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

const Circle = styled.circle`
  fill: none;
  stroke-width: ${(props) => props.strokeWidth};
  stroke-linecap: round;
  stroke-dasharray: ${(props) => props.circleLen};
  stroke-dashoffset: ${(props) => props.circleLen};
  stroke: var(--accent-color);
  transform: ${(props) => `translate(${props.padding}px,${props.padding}px)`};
  animation: ${(props) => animate(props.circleLen)} 4s linear infinite;
`;

export default function Loader({ r = 30, strokeWidth = 7, visible = true }) {
  const padding = strokeWidth;
  const circleLen = 2 * r * Math.PI;
  return (
    <SVG width={r * 2 + padding} height={r * 2 + padding} visible={visible}>
      <Circle
        cx={r}
        cy={r}
        r={r}
        strokeWidth={strokeWidth}
        padding={padding / 2}
        circleLen={circleLen}
      ></Circle>
    </SVG>
  );
}
