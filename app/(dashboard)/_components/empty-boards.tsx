'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoards = () => {
    const router = useRouter();
    const { organization } = useOrganization();
    const { mutate, pending} = useApiMutation(api.board.create);

    const onClick = async () => {
        if (!organization) return;

        mutate({ 
            orgId: organization.id,
            title: "Untitled", 
        })
            .then((id) => {
                toast.success("ボードを作成しました");
                router.push(`/board/${id}`);
            })
            .catch(() => {
                toast.error("ボードの作成に失敗しました");
            });
    }
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/note.svg"
                height={110}
                width={110}
                alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                まだボードはありません
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                ボードを作成してみましょう
            </p>
            <div className="mt-6">
                <Button disabled={pending} onClick={onClick} size={"lg"}>
                    ボードを作成
                </Button>
            </div>
        </div>
    )
}