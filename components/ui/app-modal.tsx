"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function AppModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}: AppModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} scrollBehavior="inside" radius="lg">
      <ModalContent className="rounded-card border border-border bg-surface-card shadow-card">
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-text-primary">{title}</ModalHeader>
            <ModalBody className="text-text-secondary">{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
