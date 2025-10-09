import { useId } from "react";

const XIcon = () => {
  const id = useId();

  return (
    <svg
      role="img"
      aria-label="X"
      width="21"
      height="21"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>X</title>
      <g clipPath={`url(#clip0_${id})`}>
        <path
          d="M17.9389 12.703L28.8669 0H26.2774L16.7885 11.0298L9.20986 0H0.46875L11.9292 16.679L0.46875 30H3.05849L13.0789 18.3522L21.0826 30H29.8237L17.9383 12.703H17.9389ZM14.3919 16.8259L13.2307 15.1651L3.99161 1.94952H7.9693L15.4254 12.6149L16.5866 14.2758L26.2786 28.1391H22.3009L14.3919 16.8266V16.8259Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id={`clip0_${id}`}>
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default XIcon;
