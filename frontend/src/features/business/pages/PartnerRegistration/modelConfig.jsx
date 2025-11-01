const MODEL_CONFIG = [
  {
    name: "Stay Model",
    list: [
      "accommodation for travelers or business guests",
      "comfort, convenience, and a relaxing experience",
      "stay types such as: Hotel, Resort, Homestay, Villa,...",
    ],
    color: "#1E9BCD",
    expanded: true,
    to: "stay",
    icon: (
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <title>Stay</title>
        <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19Z"></path>
      </svg>
    ),
  },
  {
    name: "F&B Model",
    list: [
      "meals, beverages, and dining experiences for customers",
      "comfort, taste, and high-quality service",
      "dining types such as: Restaurant, Café, Bar, Buffet, Street Food,...",
    ],
    color: "#F79F5C",
    to: "fnb",
    icon: (
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <title>F&B</title>
        <path d="M21 2V22H19V14H16V7C16 4.23858 18.2386 2 21 2ZM9 13.9V22H7V13.9C4.71776 13.4367 3 11.419 3 9V3H5V10H7V3H9V10H11V3H13V9C13 11.419 11.2822 13.4367 9 13.9Z"></path>
      </svg>
    ),
  },
  {
    name: "Transport Model",
    list: [
      "travel and transfer services for individuals or groups",
      "safe, efficient, and convenient mobility options",
      "transport types such as: Car Rental, Shuttle, Taxi, Bus, Bike,...",
    ],
    color: "#1ABFC3",
    to: "transport",
    icon: (
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <title>Transport</title>
        <path d="M22 13.5V21C22 21.5523 21.5523 22 21 22H20C19.4477 22 19 21.5523 19 21V20H5V21C5 21.5523 4.55228 22 4 22H3C2.44772 22 2 21.5523 2 21V13.5L0.757464 13.1894C0.312297 13.0781 0 12.6781 0 12.2192V11.5C0 11.2239 0.223858 11 0.5 11H2.375L4.51334 5.29775C4.80607 4.51715 5.55231 4 6.386 4H17.614C18.4477 4 19.1939 4.51715 19.4867 5.29775L21.625 11H23.5C23.7761 11 24 11.2239 24 11.5V12.2192C24 12.6781 23.6877 13.0781 23.2425 13.1894L22 13.5ZM4 15V17C4 17.5523 4.44772 18 5 18H8.24496C8.3272 18 8.40818 17.9797 8.4807 17.9409C8.72418 17.8107 8.81602 17.5078 8.68582 17.2643L8.68588 17.2643C7.87868 15.7548 6.31672 15 4 15ZM20 15C17.6833 15 16.1213 15.7548 15.3141 17.2643L15.3142 17.2643C15.184 17.5078 15.2758 17.8107 15.5193 17.9409C15.5918 17.9797 15.6728 18 15.755 18H19C19.5523 18 20 17.5523 20 17V15ZM6 6L4.43874 10.6838C4.40475 10.7857 4.38743 10.8925 4.38743 11C4.38743 11.5523 4.83514 12 5.38743 12H18.6126C18.7201 12 18.8268 11.9827 18.9288 11.9487C19.4527 11.774 19.7359 11.2077 19.5613 10.6838L18 6H6Z"></path>
      </svg>
    ),
  },
  {
    name: "Leisure Model",
    list: [
      "entertainment, sightseeing, and recreational activities",
      "fun, excitement, and memorable local experiences",
      "activity types such as: Theme Park, Adventure Game, Sightseeing, Show,...",
    ],
    color: "#FFC107",
    to: "leisure",
    icon: (
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <title>Leisure</title>
        <path d="M18.223 3.08609C18.7112 3.57424 18.7112 4.3657 18.223 4.85385L17.08 5.99622L18.25 5.99662C20.3211 5.99662 22 7.67555 22 9.74662V17.2466C22 19.3177 20.3211 20.9966 18.25 20.9966H5.75C3.67893 20.9966 2 19.3177 2 17.2466V9.74662C2 7.67555 3.67893 5.99662 5.75 5.99662L6.91625 5.99622L5.77466 4.85481C5.28651 4.36665 5.28651 3.5752 5.77466 3.08704C6.26282 2.59889 7.05427 2.59889 7.54243 3.08704L10.1941 5.73869C10.2729 5.81753 10.339 5.90428 10.3924 5.99638L13.6046 5.99661C13.6581 5.90407 13.7244 5.81691 13.8036 5.73774L16.4553 3.08609C16.9434 2.59793 17.7349 2.59793 18.223 3.08609ZM18.25 8.50662H5.75C5.09102 8.50662 4.55115 9.01654 4.50343 9.66333L4.5 9.75662V17.2566C4.5 17.9156 5.00992 18.4555 5.65671 18.5032L5.75 18.5066H18.25C18.909 18.5066 19.4489 17.9967 19.4966 17.3499L19.5 17.2566V9.75662C19.5 9.06626 18.9404 8.50662 18.25 8.50662ZM8.25 11.0066C8.94036 11.0066 9.5 11.5663 9.5 12.2566V13.5066C9.5 14.197 8.94036 14.7566 8.25 14.7566C7.55964 14.7566 7 14.197 7 13.5066V12.2566C7 11.5663 7.55964 11.0066 8.25 11.0066ZM15.75 11.0066C16.4404 11.0066 17 11.5663 17 12.2566V13.5066C17 14.197 16.4404 14.7566 15.75 14.7566C15.0596 14.7566 14.5 14.197 14.5 13.5066V12.2566C14.5 11.5663 15.0596 11.0066 15.75 11.0066Z"></path>
      </svg>
    ),
  },
  {
    name: "Tour Model",
    list: [
      "organized trips and guided experiences for travelers",
      "comprehensive, hassle-free, and culture-rich journeys",
      "tour types such as: Day Tour, Package Tour, Group Tour, Private Tour,...",
    ],
    color: "#EA5C35",
    to: "tour",
    icon: (
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <title>Tour</title>
        <path d="M16.9497 11.9497C18.7347 10.1648 19.3542 7.65558 18.8081 5.36796L21.303 4.2987C21.5569 4.18992 21.8508 4.30749 21.9596 4.56131C21.9862 4.62355 22 4.69056 22 4.75827V19L15 22L9 19L2.69696 21.7013C2.44314 21.8101 2.14921 21.6925 2.04043 21.4387C2.01375 21.3765 2 21.3094 2 21.2417V7L5.12892 5.65904C4.70023 7.86632 5.34067 10.2402 7.05025 11.9497L12 16.8995L16.9497 11.9497ZM15.5355 10.5355L12 14.0711L8.46447 10.5355C6.51184 8.58291 6.51184 5.41709 8.46447 3.46447C10.4171 1.51184 13.5829 1.51184 15.5355 3.46447C17.4882 5.41709 17.4882 8.58291 15.5355 10.5355Z"></path>
      </svg>
    ),
  },
];

export default MODEL_CONFIG;
