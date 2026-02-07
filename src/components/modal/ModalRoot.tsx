"use client";

import { useModalStore } from "@/stores/modalStore";
import Portal from "../portal/Portal";
import { ModalView } from "./ModalView";

export function ModalRoot() {
    const { isOpen, content, closeModal } = useModalStore();

    if (!isOpen) return null;

    return (
        <Portal>
            <ModalView onClose={closeModal}>
                {content}
            </ModalView>
        </Portal>
    );
}
