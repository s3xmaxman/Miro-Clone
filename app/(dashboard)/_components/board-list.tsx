'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyBoards } from "./empty-boards";
import { EmptyFavorite } from "./empty-favorite";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./BoardCard";

interface BoardListProps {
    orgId: string
    query: {
        search?: string
        favorite?: string
    }
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
   
    const data = useQuery(api.boards.get, { orgId })
    
    if(data === undefined) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    
    if(!data?.length && query.search) {
        return (
            <EmptySearch />  
        )
    }

    if(!data?.length && query.favorite) {
        return (
            <EmptyFavorite />
        )
    }

    if(!data?.length) {
        return (
            <EmptyBoards />
        )
    }


    return (
        <div>
            <h2 className="text-3xl">
                {query.favorite ? "お気に入りボード" : "チームボード"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 pb-1
                            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 "
            >
                {data?.map((board) => (
                    <BoardCard
                        key={board._id}
                        id={board._id} 
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorId={board.authorId}
                        authorName={board.authorName}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        isFavorite={false}
                    />
                ))}
            </div>
        </div>
    ) 
}