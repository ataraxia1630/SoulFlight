import { useId } from "react";

const FacebookIcon = () => {
  const id = useId();

  return (
    <svg
      role="img"
      aria-label="Facebook"
      width="23"
      height="23"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Facebook</title>
      <g clipPath={`url(#clip0_${id})`}>
        <g clipPath={`url(#clip1_${id})`}>
          <path
            d="M16.8175 29.8917C24.245 28.9925 30 22.6683 30 15C30 6.71583 23.2842 0 15 0C6.71583 0 0 6.71583 0 15C0 22.035 4.8425 27.9383 11.3767 29.5592L11.6667 28.3333H16.25L16.8175 29.8917Z"
            fill="#0866FF"
          />
          <path
            d="M11.3761 29.5591V19.5841H8.28027V14.9999H11.3761V13.0249C11.3761 7.9191 13.6861 5.55493 18.6961 5.55493C19.6444 5.55493 21.2819 5.74077 21.9544 5.9266V10.0791C21.6003 10.0433 20.9819 10.0249 20.2203 10.0249C17.7603 10.0249 16.8119 10.9549 16.8119 13.3791V14.9999H21.7144L20.8744 19.5833H16.8186V29.8916C14.9995 30.1107 13.1558 29.998 11.3769 29.5591H11.3761Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id={`clip0_${id}`}>
          <rect width="30" height="30" fill="white" />
        </clipPath>
        <clipPath id={`clip1_${id}`}>
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FacebookIcon;
