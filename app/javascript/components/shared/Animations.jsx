import styled, { keyframes } from 'styled-components';
import { fadeIn, slideInDown } from 'react-animations';

const fadeInAnimation = keyframes`${fadeIn}`;
const slideInDownAnimation = keyframes`${slideInDown}`;

export const FadeIn = styled.div`
  animation: 0.5s ${fadeInAnimation};
`;

export const SlideInDown = styled.div`
  animation: 0.5s ${slideInDownAnimation};
`;
