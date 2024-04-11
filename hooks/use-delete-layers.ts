import { useSelf, useMutation } from "@/liveblocks.config";



// useDeleteLayers というカスタムフックを定義しています。
export const useDeleteLayers = () => {
    // useSelf フックを使用して、現在の選択状態を取得しています。
    const selection = useSelf((me) => me.presence.selection)

    // useMutation フックを使用して、選択したレイヤーを削除する関数を返しています。
    return useMutation((
        { storage, setMyPresence },
    ) => {
        // ストレージから現在のレイヤーリストとレイヤーIDリストを取得しています。
        const liveLayers = storage.get("layers")
        const liveLayerIds = storage.get("layerIds")

        // 選択されたレイヤーIDを1つずつ処理しています。
        for (const id of selection) {
            // ストレージからレイヤーを削除しています。
            liveLayers.delete(id)
            
            // レイヤーIDリストから対応するインデックスを検索し、見つかった場合は削除しています。
            const index = liveLayerIds.indexOf(id)

            if(index !== -1) {
                liveLayerIds.delete(index)
            }
        }

        // 選択状態を空の配列に更新し、履歴に追加しています。
        setMyPresence({ selection: [] }, { addToHistory: true })   
    }, [selection])
}