import React from "react";
import "./Button.css";

const Button = ({ text, onClick, purple, disabled, icon }) => {
  return (
    <div
      onClick={onClick}
      disabled={disabled}
      className={purple ? "btn" : "btn btn-purple"}
    >
      {!purple && icon}
      {text}
    </div>
  );
};

export default Button;
