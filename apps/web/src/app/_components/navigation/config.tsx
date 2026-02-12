import { FiHome, FiList, FiPlus, FiUser } from "react-icons/fi";
import { ReactNode } from "react";

export const links: Array<{ label: string; href: string; icon: ReactNode }> = [
  { label: "Home", href: "/", icon: <FiHome /> },
  { label: "Lists", href: "/lists", icon: <FiList /> },
  { label: "Create", href: "/create", icon: <FiPlus /> },
];

export const profileLink: { label: string; href: string; icon: ReactNode } = {
  label: "Profile",
  href: "/profile",
  icon: <FiUser />,
};