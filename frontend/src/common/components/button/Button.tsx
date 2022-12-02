import React from "react";
import "./Button.scss";

interface IButtonProps {
  children: React.ReactNode;
  color?: "BC-Gov-PrimaryButton" | "BC-Gov-SecondaryButton";
  onClick: () => void;
  className?: string;
}

export const Button = ({
  children,
  color = "BC-Gov-PrimaryButton",
  onClick,
  className,
}: IButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={color + " " + className}
    >
      {children}
    </button>
  );
};
