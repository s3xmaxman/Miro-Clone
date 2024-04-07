'use client';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";

  interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
  };
  

export const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {

    const { mutate, pending } = useApiMutation(api.board.remove);
    
    const onDelete = () => {
        mutate({ id })
        .then(() => {
            toast.success(`${title}を削除しました`);
        })
        .catch(() => {
            toast.error(`${title}の削除に失敗しました`);
        })
    }


    const onCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
        .then(() => {
            toast.success(`${title}のリンクをコピーしました`);
        })
        .catch(() => {
            toast.error(`${title}のリンクのコピーに失敗しました`);
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                sideOffset={sideOffset}
                className="w-60"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem 
                    className="p-3 cursor-pointer"
                    onClick={onCopyLink}
                >
                    <Link2 className="h-4 w-4 mr-2" />
                        リンクをコピー 
                </DropdownMenuItem>
                <ConfirmModal
                   header="削除"
                   description={`${title}を削除します。よろしいですか?`}
                   disabled={pending}
                   onConfirm={onDelete}
                >
                    <Button variant="ghost" className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
                        <Trash2 className="h-4 w-4 mr-2" />
                            {title}を削除
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent> 
        </DropdownMenu>       
    );
}