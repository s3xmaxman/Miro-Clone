import { useState } from "react";
import { useMutation } from "convex/react";
import { mutation } from "@/convex/_generated/server";


export const useApiMutation = (mutationFunction:any) => {
    // API呼び出しが保留中かどうかを追跡するための状態を作成
    const [pending, setPending ] = useState(false);

    // 提供された変異関数を使用してuseMutationフックを呼び出す
    const apiMutation = useMutation(mutationFunction);

    // 変異を実行し、保留中の状態を処理する関数
    const mutate = (payload:any) => {
        // 保留中の状態をtrueに設定
        setPending(true);
        return apiMutation(payload)
            .finally(() => setPending(false)) // API呼び出しが完了した後、保留中の状態をfalseに設定
            .then((result) => { return result }) // API呼び出しが成功した場合は結果を返す
            .catch((error) => { return error }) // API呼び出しが失敗した場合はエラーを返す
    }

    // mutate関数と保留中の状態を返す
    return { mutate, pending }
}