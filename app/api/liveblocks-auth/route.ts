import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";



const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});
  


export async function POST(request: Request) {

    // 認証トークンと現在のユーザーの情報を取得する
    const authorization = await auth();
    const user = await currentUser();

    // 認証またはユーザー情報が欠けている場合は、403 Unauthorized を返す
    if (!authorization || !user) {
        return new Response("Unauthorized", { status: 403 });
    }

    
    const { room } = await request.json(); // リクエスト本文から room パラメータを取得する
    
    const board = await convex.query(api.board.get, { id: room }); // Convex から room 情報を取得する

    // 部屋の orgId が認証トークンの orgId と一致しない場合は、403 Unauthorized を返す
    if (board?.orgId !== authorization.orgId) {
        return new Response("Unauthorized", { status: 403 });
    }

    // ユーザー情報オブジェクトを作成する
    const userInfo = {
        name: user.firstName || 'Anonymous', // ユーザー名を設定する (firstName がない場合は 'Anonymous' を使用)
        picture: user.imageUrl, // ユーザーのプロフィール画像 URL を設定する
    };

    // Liveblocks セッションを準備する
    const session = liveblocks.prepareSession(
        user.id,
        { userInfo }, // ユーザー情報を渡す
    );

    // room が指定されている場合は、その room へのフルアクセスを許可する
    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    // セッションを認可し、ステータスと本文を取得する
    const { status, body } = await session.authorize();

    return new Response(body, { status });
}
