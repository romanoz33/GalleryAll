import React from 'react';
import atomize from '@quarkly/atomize';
import styled, { css, keyframes } from 'styled-components';
import { Icon } from '@quarkly/widgets';
import { AiOutlineLoading } from "react-icons/ai";
const rotate = keyframes`
	0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg); 
  } 
  100% {
    transform: rotate(360deg); 
  } 
`;

const animation = props => css`
	${rotate} 2s linear infinite
`;

const Animate = styled(Icon)`
	animation: ${animation};
`;

const Rotate = ({
	isLoading,
	children,
	...props
}) => <Animate
	{...props}
	icon={AiOutlineLoading}
	category="ai"
	size="30px"
	position="absolute"
	top="calc(50% - 15px)"
	left="calc(50% - 15px)"
	z-index="125"
	display={isLoading ? 'block' : 'none'}
>
	{children}
	 
</Animate>;

export default atomize(Rotate)({
	name: "Loader",
	normalize: true,
	mixins: true,
	description: {
		en: "Loader component"
	}
}, {
	isLoading: false
});