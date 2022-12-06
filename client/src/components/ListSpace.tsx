import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { useEffect, useContext } from "react";

import ListCard from "./ListCard";
import StoreContext from "../store";
import { CurrentScreen } from "../store";

function ListSpace() {
    const store = useContext(StoreContext);

    useEffect(() => {
        console.log(store);
        if (store.store.currentScreen === CurrentScreen.HOME) {
            store.loadListsData("self", "");
        } else if (store.store.currentScreen === CurrentScreen.PLAYLISTS) {
        } else {
        }
    }, []);

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
            {store.store.currentlyLoadedLists.map((x: SongList) => (
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
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default ListSpace;
