import { Logo } from "./Logo";

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  return (
    <header className="px-12 py-6 justify-between">
      <Logo />
    </header>
  );
};
