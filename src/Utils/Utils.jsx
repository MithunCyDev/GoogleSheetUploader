import "./Utils.css";
const Button = ({
  onClick,
  children,
  type = "button",
  disabled,
  backgroundColor,
}) => (
  <button
    style={{ backgroundColor: backgroundColor }}
    className={"buttonDanger"}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export { Button };
