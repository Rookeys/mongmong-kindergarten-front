"use client";

import { useModalStore } from "@/stores/modalStore";
import Portal from "@/components/portal/Portal"
import { ModalView } from "@/components/modal/ModalView";

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
