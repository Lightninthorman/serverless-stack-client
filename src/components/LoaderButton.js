import React from "react";
import { Button } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi"
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <FiRefreshCw glyph="refresh" className="spinning" />}
      {props.children}
    </Button>
  );
}

//Notes:
// Button
//   className={`LoaderButton ${className}`}
//   --> disabled={disabled || isLoading} --> disabled prop is true while validateForm is running, isLoading is true when it is logging in.
//   {...props}
