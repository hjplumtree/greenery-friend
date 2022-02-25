import React from 'react';
import { StyledButton } from "./Button.style";

interface ButtonProps {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  className: string;
  children: JSX.Element | JSX.Element[];
}

export default function Button({ handleClick, className, children }: ButtonProps) {
  return (
    <StyledButton className={className} onClick={handleClick}>
      {children}
    </StyledButton>
  );
}
