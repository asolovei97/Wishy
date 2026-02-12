import { FiHome, FiList, FiPlus, FiUser } from "react-icons/fi";

export const links = [
  { label: "Home", href: "/", icon: <FiHome /> },
  { label: "Lists", href: "/lists", icon: <FiList /> },
  { label: "Create", href: "/create", icon: <FiPlus /> },
];

export const profileLink = {
  label: "Profile",
  href: "/profile",
  icon: <FiUser />,
};