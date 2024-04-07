import Image from "next/image";

export const EmptyFavorite = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.svg"
        height={140}
        width={140}
        alt="Empty"
      />
      <h2 className="text-2xl font-semibold mt-6">
        お気に入りのボードはありません
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
            お気に入りのボードを追加してください
      </p>
    </div>
  );
};