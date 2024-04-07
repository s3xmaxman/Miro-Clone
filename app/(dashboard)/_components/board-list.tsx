'use client';

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorite } from "./empty-favorite";
import { EmptySearch } from "./empty-search";

interface BoardListProps {
    orgId: string
    query: {
        search?: string
        favorite?: string
    }
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
   
    const data = []
    
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
            {JSON.stringify(query)}
        </div>
    )
}