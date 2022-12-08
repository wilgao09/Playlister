import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { useEffect, useContext, useState } from "react";

import ListCard from "./ListCard";
import StoreContext from "../store";
import { SortOrder } from "../store";

// const orderFunctions = {

// }

function ListSpace() {
    const store = useContext(StoreContext);
    const [lastScreen, setLastScreen] = useState(-1);
    const [lastQuery, setLastQuery] = useState("\0");
    const [lastSort, setSort] = useState(-1);

    // useEffect(() => {

    // }, []);

    if (
        lastScreen !== store.store.currentScreen ||
        lastQuery !== store.store.searchQuery ||
        lastSort !== store.store.sortOrder
    ) {
        setLastQuery(store.store.searchQuery);
        setLastScreen(store.store.currentScreen);
        setSort(store.store.sortOrder);
        store.reloadLists();
    }

    let displayOrder = [...store.store.currentlyLoadedLists];
    let lambda = (a: SongList, b: SongList) => a.name.localeCompare(b.name);
    switch (store.store.sortOrder) {
        case SortOrder.NAME_ASC: {
            lambda = (a, b) => a.name.localeCompare(b.name);
            break;
        }
        case SortOrder.PUBLISH_DESC: {
            lambda = (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime();
            break;
        }
        case SortOrder.LISTEN_DESC: {
            lambda = (a, b) => b.listens - a.listens;
            break;
        }
        case SortOrder.LIKE_DESC: {
            lambda = (a, b) => b.upvotes - a.upvotes;
            break;
        }
        case SortOrder.DISLIKE_DESC: {
            lambda = (a, b) => b.downvotes - a.downvotes;
            break;
        }
        case SortOrder.CREATE_ASC: {
            lambda = (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();
            break;
        }
        case SortOrder.EDIT_ASC: {
            lambda = (a, b) =>
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime();
            break;
        }
    }

    displayOrder = displayOrder.sort(lambda);

    const colorPicker = (isPublished: boolean) => {
        if (store.store.currentPlayingList.length > 0) {
            return "gold";
        } else if (isPublished) {
            return "aliceblue";
        } else {
            return "white";
        }
    };
    return (
        <List
            sx={{
                maxHeight: "97%",
                overflowY: "scroll",
                alignItems: "center",
            }}
        >
            {displayOrder.map((x: SongList) => (
                <ListItem
                    sx={{
                        width: "100%",
                    }}
                >
                    <ListCard
                        _id={x._id}
                        name={x.name}
                        listens={x.listens}
                        published={x.published}
                        createdAt={x.createdAt}
                        updatedAt={x.updatedAt}
                        owner={x.owner}
                        upvotes={x.upvotes}
                        downvotes={x.downvotes}
                        userLiked={x.userLiked}
                        userDisliked={x.userDisliked}
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default ListSpace;
