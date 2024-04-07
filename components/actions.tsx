'use client';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

  import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

  interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
  };
  

export const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {

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
            </DropdownMenuContent> 
        </DropdownMenu>       
    );
}