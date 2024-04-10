import { shallow } from "@liveblocks/react";

import { Layer, XYWH } from "@/types/canvas";
import { useStorage, useSelf } from "@/liveblocks.config";


// レイヤー群の境界ボックスを計算する関数
const boundingBox = (layer: Layer[]): XYWH | null => {
    // 最初のレイヤーを取得
    const first = layer[0];

    // レイヤーが存在しない場合は null を返す
    if (!first) return null;

    // 左端、右端、上端、下端の初期値を最初のレイヤーの位置とサイズから設定
    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    // 2 番目のレイヤー以降をループする
    for (let i = 1; i < layer.length; i++) {
        // レイヤーの位置とサイズを取得
        const { x, y, width, height } = layer[i];

        // 左端が x より大きい場合、左端を更新
        if (left > x) left = x;

        // 右端が x + width より小さい場合、右端を更新
        if (right < x + width) right = x + width;

        // 上端が y より大きい場合、上端を更新
        if (top > y) top = y;

        // 下端が y + height より小さい場合、下端を更新
        if (bottom < y + height) bottom = y + height;
    }

    // 計算した境界ボックスを返す
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

// 選択されたレイヤーの境界ボックスを取得するフック
export const useSelectionBounds = () => {
    // 選択されたレイヤーの ID を取得
    const selection = useSelf((me) => me.presence.selection);

    // 選択されたレイヤーを取得し、境界ボックスを計算して返す
    return useStorage((root) => {
        const selectedLayers = selection
            .map((layerId) => root.layers.get(layerId)!) // レイヤー ID からレイヤーを取得
            .filter(Boolean); // null を除外

        return boundingBox(selectedLayers); // 境界ボックスを計算
    }, shallow);
};