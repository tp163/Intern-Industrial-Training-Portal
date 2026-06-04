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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
      radius="lg"
      placement="center"
      isDismissable
      classNames={{
        wrapper: "z-[100] items-end p-0 sm:items-center sm:p-4",
        base: "m-0 max-h-[92dvh] w-full rounded-none sm:m-auto sm:max-h-[85vh] sm:rounded-card",
      }}
    >
      <ModalContent className="rounded-card border border-border bg-surface-card shadow-card">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pr-8 text-base text-text-primary sm:text-lg">
              {title}
            </ModalHeader>
            <ModalBody className="text-text-secondary">{children}</ModalBody>
            {footer && (
              <ModalFooter className="flex flex-wrap gap-2 border-t border-border/60">
                {footer}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
