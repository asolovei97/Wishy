"use client";

import { createPortal } from "react-dom";
import { PropsWithChildren, useEffect, useState } from "react";
import { modalContext, useModalContext } from "./modal-context";
import { Button } from "../buttons/Button";

interface ModalProps extends PropsWithChildren {
  forceState?: boolean;
}

const Trigger = ({ children }: PropsWithChildren) => {
  const { handleToggle } = useModalContext();
  return <div onClick={handleToggle}>{children}</div>;
};

const ModalContent = ({ children }: PropsWithChildren) => {
  const { isOpen, handleToggle } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="fixed inset-0" onClick={handleToggle} />
      <div className="relative z-50 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>,
    document.body
  );
};

const Header = ({ children }: PropsWithChildren) => {
  const { handleToggle } = useModalContext();
  return (
    <div className="flex items-center justify-between border-b border-primary-200 px-6 py-4">
      <div className="flex-1 overflow-hidden text-lg font-semibold">
        {children}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="ml-4 h-8 w-8 rounded-full hover:bg-stone-100"
        Icon={<span className="text-xl leading-none text-stone-800">&times;</span>}
      />
    </div>
  );
};

const Content = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {children}
    </div>
  );
};

const Footer = ({ children }: PropsWithChildren) => {
  return (
    <div className="border-t border-primary-200 bg-primary-50/50 px-6 py-4">
      {children}
    </div>
  );
};

interface ModalComponent extends React.FC<ModalProps> {
  Trigger: typeof Trigger;
  Content: typeof ModalContent;
  Header: typeof Header;
  ContentArea: typeof Content;
  Footer: typeof Footer;
}

const Modal: ModalComponent = ({ forceState = false, children }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(forceState);

  const handleToggle = () => setIsOpen((value) => !value);

  return (
    <modalContext.Provider value={{ isOpen, handleToggle }}>
      {children}
    </modalContext.Provider>
  );
};

Modal.Trigger = Trigger;
Modal.Content = ModalContent;
Modal.Header = Header;
Modal.ContentArea = Content;
Modal.Footer = Footer;

export { Modal };
