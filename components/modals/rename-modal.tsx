'use client';

import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRenameModal } from "@/store/use-rename-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";


export const RenameModal = () => {

    const { mutate, pending } = useApiMutation(api.board.update);

    const { isOpen, onClose, initialValues } = useRenameModal();
    const [title, setTitle] = useState(initialValues.title);

    useEffect(() => {
        setTitle(initialValues.title);
    }, [initialValues.title]);

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        mutate({ id: initialValues.id, title })
            .then(() => {
                toast.success("名前を変更しました");
                onClose();
            })
            .catch(() => {
                toast.error("名前の変更に失敗しました");
            })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        リネーム
                    </DialogTitle>
                </DialogHeader>
                    <DialogDescription>
                        新しい名前を入力してください
                    </DialogDescription>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input
                            disabled={pending}
                            required
                            maxLength={60}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="名前"
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    キャンセル
                                </Button>
                            </DialogClose>
                            <Button disabled={pending} type="submit">
                                保存
                            </Button>
                        </DialogFooter>    
                    </form>
            </DialogContent>
        </Dialog>
    )
}