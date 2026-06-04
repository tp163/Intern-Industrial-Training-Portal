import { addToast } from "@heroui/react";

export function notifySuccess(message: string, title = "Success") {
  addToast({ title, description: message, color: "success", timeout: 4000 });
}

export function notifyError(message: string, title = "Error") {
  addToast({ title, description: message, color: "danger", timeout: 5000 });
}

export function notifyInfo(message: string, title = "Notice") {
  addToast({ title, description: message, color: "primary", timeout: 4000 });
}
