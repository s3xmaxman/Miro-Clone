// import { v } from "convex/values";
// import { getAllOrThrow } from "convex-helpers/server/relationships";
// import { query } from "./_generated/server";




// export const get = query({
//     args: {
//         orgId: v.string(), // 組織のID
//         search: v.optional(v.string()), // オプションの検索クエリ
//         favorite: v.optional(v.string()), // お気に入りボードをフィルタリングするためのオプションのフラグ
//     },
//     handler: async (ctx, args) => {
//         // ユーザーのIDを取得
//         const identity = await ctx.auth.getUserIdentity();

//         // ユーザーが認証されていない場合はエラーをスロー
//         if (!identity) {
//             throw new Error("Unauthorized");
//         }

//         // お気に入りボードをリクエストしている場合
//         if (args.favorite) {
//             // ユーザーと組織IDに基づいてお気に入りボードを取得
//             const favoriteBoards = await ctx.db
//                 .query("userFavorites")
//                 .withIndex("by_user_org", (q) => 
//                     q
//                     .eq("userId", identity.subject) // ユーザーIDと一致
//                     .eq("orgId", args.orgId) // 組織IDと一致
//                 )
//                 .order("desc") // 降順で並べ替え
//                 .collect(); // 結果を取得

//             // お気に入りボードのボードIDを取得
//             const ids = favoriteBoards.map((b) => b.boardId);
            
//             // ボードIDに基づいてボードを取得
//             const boards = await getAllOrThrow(ctx.db, ids)

//             // ボードに isFavorite プロパティを追加
//             return boards.map((board) => ({
//                 ...board,
//                 isFavorite: true, // お気に入りフラグを true に設定
//             }))
//         }

//         // 検索クエリがある場合
//         const title = args.search as string;

//         let boards = [];

//         // 検索クエリがある場合
//         if (title) {
//             // タイトルと組織IDに基づいてボードを検索
//             boards = await ctx.db
//                 .query("boards")
//                 .withSearchIndex("search_title", (q) => 
//                     q
//                     .search("title", title) // タイトルで検索
//                     .eq("orgId", args.orgId) // 組織IDと一致
//                 )
//                 .collect(); // 結果を取得

//         } else {
//             // 検索クエリがない場合は、組織IDに基づいてボードを取得
//             boards = await ctx.db
//                 .query("boards")
//                 .withIndex("by_org", (q) => q.eq("orgId", args.orgId)) // 組織IDと一致
//                 .order("desc") // 降順で並べ替え
//                 .collect(); // 結果を取得
//         }

//         // ボードごとに、ユーザーがお気に入りとしてマークしたかどうかを確認
//         const boardsWithFavoriteRelation = boards.map((board) => {
//             return ctx.db
//                 .query("userFavorites")
//                 .withIndex("by_user_board", (q) => 
//                 q
//                     .eq("userId", identity.subject) // ユーザーIDと一致
//                     .eq("boardId", board._id) // ボードIDと一致
//                 )
//                 .unique() // 重複を削除
//                 .then((favorite) => {
//                 return {
//                     ...board,
//                     isFavorite: !!favorite, // お気に入りフラグを設定
//                 };
//                 });
//             });
        
//         // Promise.all を使用して、すべてのボードのお気に入りフラグを取得
//         const boardsWithFavoriteBoolean = await Promise.all(boardsWithFavoriteRelation);
        
//         return boardsWithFavoriteBoolean;
//     },
// })


import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";
import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }

    const title = args.search as string;
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) => q.search("title", title))
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return { ...board, isFavorite: !!favorite };
        });
    });

    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

    return boardsWithFavoriteBoolean;
  },
});