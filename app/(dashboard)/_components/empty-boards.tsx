import { Button } from "@/components/ui/button";
import Image from "next/image";


export const EmptyBoards = () => {
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
                <Button size={"lg"}>
                    ボードを作成
                </Button>
            </div>
        </div>
    )
}