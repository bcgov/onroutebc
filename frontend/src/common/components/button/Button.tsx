import React from "react";
import "./Button.scss";

interface IButtonProps {
  children: React.ReactNode;
  label: string;
  color?: "BC-Gov-PrimaryButton" | "BC-Gov-SecondaryButton";
  onClick: () => void;
}

export const Button = ({ children, label, color = "BC-Gov-PrimaryButton", onClick } : IButtonProps) => {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={color}
    >
      {children}
    </button>
  );
};
