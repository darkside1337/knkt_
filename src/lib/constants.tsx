import {
  FiHome,
  FiSearch,
  FiMail,
  FiBell,
  FiUser,
  FiSettings,
} from "react-icons/fi";

export const BCRYPT_SALT_ROUNDS: number = 12;

// home search messages notifications theme toggle
export const MobileBottomBarNavItems = [
  {
    id: 1,
    href: "/",
    icon: <FiHome className="size-6" />,
    ariaLabel: "Home",
  },
  {
    id: 2,
    href: "/search",
    icon: <FiSearch className="size-6" />,
    ariaLabel: "Search",
  },
  {
    id: 3,
    href: "/messages",
    icon: <FiMail className="size-6" />,
    ariaLabel: "Messages",
  },
  {
    id: 4,
    href: "/notifications",
    icon: <FiBell className="size-6" />,
    ariaLabel: "Notifications",
  },
];

// profile settings and privacy messages logout
export const MobileSideBarNavItems = [
  {
    id: "home",
    icon: <FiHome className="size-6" />,
    text: "Home",
    href: "/",
  },
  {
    id: "profile",
    icon: <FiUser className="size-6" />,
    text: "Profile",
    href: `/profile/`,
  },
  {
    id: "settings",
    icon: <FiSettings className="size-6" />,
    text: "Settings & Privacy",
    href: "/profile/settings",
  },
  {
    id: "messages",
    icon: <FiMail className="size-6" />,
    text: "Messages",
    href: "/messages",
  },
];

export const GENDER_ENUM = [
  "NOT_MENTIONED",
  "MALE",
  "FEMALE",
  "OTHER",
] as const;
export const RELATIONSHIP_STATUS_ENUM = [
  "NOT_MENTIONED",
  "SINGLE",
  "MARRIED",
  "ENGAGED",
  "IN_A_RELATIONSHIP",
] as const;
export const MOBILE_NAVBAR_HEIGHT_IN_PX = 112;

export const MAX_PROFILE_PICTURE_SIZE_IN_KB = 3 * 1024 * 1024; // 3MB

export const MIN_DIMENSIONS = { width: 100, height: 100 };
export const MAX_DIMENSIONS = { width: 4096, height: 4096 };
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 35;
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_BIO_LENGTH = 3;
export const MAX_BIO_LENGTH = 258;
