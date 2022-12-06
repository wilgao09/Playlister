import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./store-request-api";
import AuthContext from "../auth";
import tsTPS from "../common/tsTPS";

import CreateSongTransaction from "../transactions/CreateSongTransaction";
import RemoveSongTransaction from "../transactions/RemoveSongTransaction";

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

enum CurrentModal {
    NONE,
    DELETE_LIST,
    EDIT_SONG,
    REMOVE_SONG,
}

enum CurrentScreen {
    HOME,
    USERS,
    PLAYLISTS,
}

enum CurrentTab {
    VIDEO,
    COMMENTS,
}

enum SortOrder {
    NAME_ASC,
    PUBLISH_DESC,
    LISTEN_DESC,
    LIKE_DESC,
    DISLIKE_DESC,
    CREATE_ASC,
    EDIT_ASC,
}
enum DeltaType {
    CREATE = "CREATE",
    EDIT = "EDIT",
    DELETE = "DELETE",
    MOVE = "MOVE",
}

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
let initial__store: Store = {
    store: {
        currentModal: CurrentModal.NONE,
        currentlyLoadedLists: [],
        currentListId: -100,
        currentList: [],
        searchQuery: "",
        currentScreen: CurrentScreen.HOME,
        currentPlayerTab: CurrentTab.VIDEO,
        sortOrder: SortOrder.NAME_ASC,
        listNameToEdit: -1,
        currentPlayingList: [],
        currentPlayingSongIndex: -1,
        currentSongIndex: -1,
        currentSong: null,
        listToDelete: -1,
        currentPlayingListId: -100,
    },
    changeListName: (id: number, newName: string) => {},
    closeCurrentList: () => {},
    createNewList: () => {},
    loadListsData: (by: string, search: string) => {},
    deleteList: (id: number) => {},
    hideModals: () => {},
    showEditSongModal: (songIndex: number, songToEdit: Song) => {},
    showRemoveSongModal: (songIndex: number, songToRemove: Song) => {},
    isDeleteListModalOpen: () => false,
    isEditSongModalOpen: () => false,
    isRemoveSongModalOpen: () => false,
    isModalOpen: () => false,
    setCurrentList: (id: number) => {},
    getPlaylistSize: () => -1,
    createSong: (index: number, song: Song) => {},
    addNewSong: (song: Song) => {},
    removeSong: (index: number) => {},
    undo: () => {},
    redo: () => {},
};

let GlobalStoreContext: React.Context<Store> =
    createContext<Store>(initial__store);
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export enum GlobalStoreActionType {
    CHANGE_LIST_NAME,
    CLOSE_CURRENT_LIST,
    CREATE_NEW_LIST,
    LOAD_ID_NAME_PAIRS,
    DELETE_LIST,
    SET_CURRENT_LIST,
    SET_LIST_NAME_EDIT_ACTIVE,
    EDIT_SONG,
    REMOVE_SONG,
    HIDE_MODALS,
    RESET,
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new tsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider({
    children,
}: JSX.ElementChildrenAttribute) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    let initial__state: StoreState = {
        currentModal: CurrentModal.NONE,
        currentlyLoadedLists: [],
        currentListId: -100,
        currentList: null,
        searchQuery: "",
        currentScreen: CurrentScreen.HOME,
        currentPlayerTab: CurrentTab.VIDEO,
        sortOrder: SortOrder.NAME_ASC,
        listNameToEdit: -100,
        currentPlayingList: [],
        currentPlayingSongIndex: -1,
        currentSongIndex: -1,
        currentSong: null,
        listToDelete: -100,
        currentPlayingListId: -100,
    };

    const [storeState, setStore] = useState<StoreState>(initial__state);
    const navigate = useNavigate();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action: {
        type: GlobalStoreActionType;
        payload: any;
    }) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.RESET: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: [],
                    currentListId: -100,
                    currentList: null,
                    searchQuery: "",
                    currentScreen: CurrentScreen.HOME,
                    currentPlayerTab: CurrentTab.VIDEO,
                    sortOrder: SortOrder.NAME_ASC,
                    listNameToEdit: -100,
                    currentPlayingList: [],
                    currentPlayingSongIndex: -100,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: -100,
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: payload.listsData, //TODO: here
                    currentListId: -100,
                    currentList: null,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: -100,
                    currentList: null,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: payload.listsData,
                    currentListId: payload.listId,
                    currentList: payload.list,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: payload.listsData,
                    currentListId: storeState.currentListId,
                    currentList: null,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            // // // PREPARE TO DELETE A LIST
            // case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
            //     return setStore({
            //         currentModal: CurrentModal.DELETE_LIST,
            //         idNamePairs: store.idNamePairs,
            //         currentList: null,
            //         currentSongIndex: -1,
            //         currentSong: null,
            //         newListCounter: store.newListCounter,
            //         listNameActive: false,
            //         listIdMarkedForDeletion: payload.id,
            //         listMarkedForDeletion: payload.playlist,
            //     });
            // }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: -100,
                    currentList: [],
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList, //TODO: what if i delete the paying list
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId, // TODO help
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: payload.listId,
                    currentList: payload.listData, //TODO: here
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: storeState.currentSongIndex,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: -100,
                    currentList: null,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: payload.playlistId, //TODO: here
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            //TODO: entire thing fucked
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: payload.songIndex,
                    currentSong: payload.song,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            //TODO: same as above
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    // currentModal: CurrentModal.REMOVE_SONG,
                    // idNamePairs: store.idNamePairs,
                    // currentList: store.currentList,
                    // currentSongIndex: payload.currentSongIndex,
                    // currentSong: payload.currentSong,
                    // newListCounter: store.newListCounter,
                    // listNameActive: false,
                    // listIdMarkedForDeletion: null,
                    // listMarkedForDeletion: null,
                    currentModal: CurrentModal.REMOVE_SONG,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: payload.songIndex,
                    currentSong: payload.song,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: payload.songIndex,
                    currentSong: payload.song,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                });
            }
            default:
                return storeState;
        }
    };

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME

    const changeListName = function (id: number, newName: string) {
        api.renamePlaylist(id, newName).then((res) => {
            if (res.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                    payload: storeState.currentlyLoadedLists.map((x) => {
                        if (x._id === id) {
                            x.name = newName;
                        }
                        return x;
                    }),
                });
            }
        });
    };

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    const closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {},
        });
        tps.clearAllTransactions();
    };

    // THIS FUNCTION CREATES A NEW LIST
    const createNewList = async function () {
        let newListName = "Untitled";
        const response = await api.createPlaylist(newListName);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            api.getUserLists().then((response) => {
                if (response.status === 200) {
                    let pairsArray = response.data.playlists;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            listsData: pairsArray,
                            listId: newList._id,
                            list: [],
                        },
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            });

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/playlist/" + newList._id);
        } else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    };

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    const loadListsData = function (by: string = "self", search: string = "") {
        let query;
        if (by == "self") {
            query = api.getUserLists;
        } else {
            //TODO:
            alert("bad query");
            query = api.getUserLists;
        }
        console.log(query);
        query().then((response) => {
            if (response.status === 200) {
                console.log("ID PAIRS RESPONSE");
                console.log(response);
                let pairsArray = response.data.playlists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        listsData: pairsArray,
                    },
                });
            } else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        });
    };

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    // store.markListForDeletion = function (id) {
    //     async function getListToDelete(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;
    //             storeReducer({
    //                 type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
    //                 payload: { id: id, playlist: playlist },
    //             });
    //         }
    //     }
    //     getListToDelete(id);
    // };

    // const showDeleteListModal = function (id: number) {};
    const deleteList = function (id: number) {
        api.deletePlaylistById(id).then((response) => {
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.DELETE_LIST,
                    payload: storeState.currentlyLoadedLists.filter(
                        (x) => x._id != id
                    ),
                });
            } else {
                alert("???? failed delete");
            }
        });
    };

    const hideModals = function () {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: null,
        });
    };
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    const showEditSongModal = (songIndex: number, songToEdit: Song) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { songIndex: songIndex, song: songToEdit },
        });
    };
    const showRemoveSongModal = (songIndex: number, songToRemove: Song) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { songIndex: songIndex, song: songToRemove },
        });
    };

    const isDeleteListModalOpen = () => {
        return storeState.currentModal === CurrentModal.DELETE_LIST;
    };
    const isEditSongModalOpen = () => {
        return storeState.currentModal === CurrentModal.EDIT_SONG;
    };
    const isRemoveSongModalOpen = () => {
        return storeState.currentModal === CurrentModal.REMOVE_SONG;
    };
    const isModalOpen = () => storeState.currentModal !== CurrentModal.NONE;

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    const setCurrentList = function (id: number) {
        if (id < 0) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {
                    listData: null,
                    listId: -100,
                },
            });
        }
        api.getPlaylistById(id).then((response) => {
            tps.clearAllTransactions();
            if (response.status === 200) {
                console.log("RESPONSE TO PLAYLIST HERE");

                let playlist = response.data.playlist;
                console.log(playlist);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        listData: playlist,
                        listId: id,
                    },
                });
            }
        });
    };
    //TODO: whats this used for
    const getPlaylistSize = function () {
        if (storeState.currentList === null) return 0;
        return storeState.currentList.length;
    };

    // // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    // store.moveSong = function (start, end) {
    //     let list = store.currentList;

    //     // WE NEED TO UPDATE THE STATE FOR THE APP
    //     if (start < end) {
    //         let temp = list.songs[start];
    //         for (let i = start; i < end; i++) {
    //             list.songs[i] = list.songs[i + 1];
    //         }
    //         list.songs[end] = temp;
    //     } else if (start > end) {
    //         let temp = list.songs[start];
    //         for (let i = start; i > end; i--) {
    //             list.songs[i] = list.songs[i - 1];
    //         }
    //         list.songs[end] = temp;
    //     }

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // };

    // // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    // store.updateSong = function (index, songData) {
    //     let list = store.currentList;
    //     let song = list.songs[index];
    //     song.title = songData.title;
    //     song.artist = songData.artist;
    //     song.youTubeId = songData.youTubeId;

    //     // NOW MAKE IT OFFICIAL
    //     store.updateCurrentList();
    // };
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    const createSong = function (index: number, song: Song) {
        let listid = store.store.currentListId;
        api.updatePlaylistById(listid, {
            type: DeltaType.CREATE,
            d0: index,
            d1: song,
        }).then((res) => {
            if (storeState.currentList === null) return;
            if (res.status === 200) {
                let list = [...storeState.currentList];
                if (list === null) return;
                list.splice(index, 0, song);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        listData: list,
                        listId: listid,
                    },
                });
            }
        });
    };

    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    const _removeSong = function (index: number) {
        let listid = storeState.currentListId;
        api.updatePlaylistById(listid, {
            type: DeltaType.DELETE,
            d0: index,
            d1: index,
        }).then((res) => {
            if (storeState.currentList === null) return;
            if (res.status === 200) {
                let list = [...storeState.currentList];
                if (list === null) return;
                list.splice(index, 1);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        listData: list,
                        listId: listid,
                    },
                });
            }
        });
    };

    const addNewSong = function (song: Song) {
        if (song === undefined) {
            song = {
                title: "Untitled",
                artist: "Unknown",
                youTubeId: "dQw4w9WgXcQ",
            };
        }
        let index = getPlaylistSize();
        let listid = storeState.currentListId;
        tps.addTransaction(
            new CreateSongTransaction(
                createSong,
                _removeSong,
                listid,
                index,
                song
            )
        );
    };

    const removeSong = (index: number) => {
        //TODO: bounds check?
        if (storeState.currentList === null) {
            return;
        }
        let s = storeState.currentList[index];
        tps.addTransaction(
            new RemoveSongTransaction(
                _removeSong,
                createSong,
                storeState.currentListId,
                index,
                s
            )
        );
    };

    // store.addMoveSongTransaction = function (start, end) {
    //     let transaction = new MoveSong_Transaction(store, start, end);
    //     tps.addTransaction(transaction);
    // };
    // // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    // store.addRemoveSongTransaction = () => {
    //     let index = store.currentSongIndex;
    //     let song = store.currentList.songs[index];
    //     let transaction = new RemoveSong_Transaction(store, index, song);
    //     tps.addTransaction(transaction);
    // };
    // store.addUpdateSongTransaction = function (index, newSongData) {
    //     let song = store.currentList.songs[index];
    //     let oldSongData = {
    //         title: song.title,
    //         artist: song.artist,
    //         youTubeId: song.youTubeId,
    //     };
    //     let transaction = new UpdateSong_Transaction(
    //         this,
    //         index,
    //         oldSongData,
    //         newSongData
    //     );
    //     tps.addTransaction(transaction);
    // };
    // store.updateCurrentList = function () {
    //     async function asyncUpdateCurrentList() {
    //         const response = await api.updatePlaylistById(
    //             store.currentList._id,
    //             store.currentList
    //         );
    //         if (response.data.success) {
    //             storeReducer({
    //                 type: GlobalStoreActionType.SET_CURRENT_LIST,
    //                 payload: store.currentList,
    //             });
    //         }
    //     }
    //     asyncUpdateCurrentList();
    // };
    const undo = function () {
        tps.undoTransaction();
    };
    const redo = function () {
        tps.doTransaction();
    };
    // store.canAddNewSong = function () {
    //     return !store.isModalOpen() && store.currentList !== null;
    // };
    // const canUndo = function () {
    //     return (
    //         !store.isModalOpen() &&
    //         store.currentList !== null &&
    //         tps.hasTransactionToUndo()
    //     );
    // };
    // const canRedo = function () {
    //     return (
    //         !store.isModalOpen() &&
    //         store.currentList !== null &&
    //         tps.hasTransactionToRedo()
    //     );
    // };
    // const canClose = function () {
    //     return !store.isModalOpen() && store.currentList !== null;
    // };

    // // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    // store.setIsListNameEditActive = function () {
    //     storeReducer({
    //         type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
    //         payload: null,
    //     });
    // };

    // store.reset = function () {
    //     storeReducer({
    //         type: GlobalStoreActionType.RESET,
    //         payload: null,
    //     });
    // };

    let store: Store = {
        store: storeState,
        changeListName: changeListName,
        closeCurrentList: closeCurrentList,
        createNewList: createNewList,
        loadListsData: loadListsData,
        deleteList: deleteList,
        hideModals: hideModals,
        showEditSongModal: showEditSongModal,
        showRemoveSongModal: showRemoveSongModal,
        isDeleteListModalOpen: isDeleteListModalOpen,
        isEditSongModalOpen: isEditSongModalOpen,
        isRemoveSongModalOpen: isRemoveSongModalOpen,
        isModalOpen: isModalOpen,
        setCurrentList: setCurrentList,
        getPlaylistSize: getPlaylistSize,
        createSong: createSong,
        addNewSong: addNewSong,
        removeSong: removeSong,
        undo: undo,
        redo: redo,
    };

    // GlobalStoreContext = createContext(store);

    return (
        <GlobalStoreContext.Provider value={store}>
            <>{children}</>
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export {
    GlobalStoreContextProvider,
    CurrentModal,
    CurrentScreen,
    CurrentTab,
    SortOrder,
    DeltaType,
};
