import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./store-request-api";
import AuthContext from "../auth";
import tsTPS from "../common/tsTPS";

import CreateSongTransaction from "../transactions/CreateSongTransaction";
import RemoveSongTransaction from "../transactions/RemoveSongTransaction";
import MoveSongTransaction from "../transactions/MoveSongTransaction";
import EditSongTransaction from "../transactions/EditSongTransaction";

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
        currentPlayingListName: "",
    },
    changeListName: (id: number, newName: string) => Promise.resolve(true),
    closeCurrentList: () => {},
    createNewList: () => {},
    reloadLists: () => {},
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
    duplicateList: () => {},
    publishPlaylist: () => {},
    moveSong: (start: number, end: number) => {},
    raiseModal: (modal: CurrentModal, payload: any) => {},
    editSong: (index: number, ndata: Song) => {},
    getComments: () => Promise.resolve(0),
    postComment: (comment: string) => Promise.resolve(0),
    playSong: (id: number, list: Song[], name: string, ind: number) => 0,
    likePlaylist: (id: number, liked: boolean) => {},
    changeQuery: (query: string) => {},
    changeScreen: (screen: CurrentScreen) => {},
    changeSortOrder: (m: SortOrder) => {},
    resetState: () => {},
    playId: (id: number) => {},
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
    SET_PLAYING,
    CHANGE_SEARCH,
    CHANGE_SCREEN,
    CHANGE_SORT_ORDER,
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
        currentPlayingListName: "",
    };

    const [storeState, setStore] = useState<StoreState>(initial__state);
    const navigate = useNavigate();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const bigAuth = useContext(AuthContext);
    let auth = bigAuth.auth;
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
                    currentPlayingListName: "",
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName,
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: payload.listsData,
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName, //TODO what if
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentPlayingListName: storeState.currentPlayingListName,
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
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                    currentPlayingListName: storeState.currentPlayingListName,
                });
            }
            case GlobalStoreActionType.SET_PLAYING: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists:
                        payload.lists ?? storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: payload.list,
                    currentPlayingSongIndex: payload.index,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: payload.id,
                    currentPlayingListName: payload.name,
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: payload.query,
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
                    currentPlayingListName: storeState.currentPlayingListName,
                });
            }
            case GlobalStoreActionType.CHANGE_SCREEN: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: payload.screen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: storeState.sortOrder,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                    currentPlayingListName: storeState.currentPlayingListName,
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_ORDER: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentlyLoadedLists: storeState.currentlyLoadedLists,
                    currentListId: storeState.currentListId,
                    currentList: storeState.currentList,
                    searchQuery: storeState.searchQuery,
                    currentScreen: storeState.currentScreen,
                    currentPlayerTab: storeState.currentPlayerTab,
                    sortOrder: payload.order,
                    listNameToEdit: -100,
                    currentPlayingList: storeState.currentPlayingList,
                    currentPlayingSongIndex: storeState.currentPlayingSongIndex,
                    currentSongIndex: -100,
                    currentSong: null,
                    listToDelete: -100,
                    currentPlayingListId: storeState.currentPlayingListId,
                    currentPlayingListName: storeState.currentPlayingListName,
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
        return api.renamePlaylist(id, newName).then((res) => {
            if (res.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                    payload: {
                        listsData: storeState.currentlyLoadedLists.map((x) => {
                            if (x._id === id) {
                                x.name = newName;
                            }
                            return x;
                        }),
                    },
                });
                return true;
            }
            return false;
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
            //TODO: ??? VVV what if im searching
            api.getUserLists().then((response) => {
                if (response.status === 200) {
                    let pairsArray = response.data.playlist;
                    reloadLists();
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
    // const loadListsData = function (by: string = "self", search: string = "") {
    //     let query;
    //     if (by === "self") {
    //         query = () => api.getUserLists(search);
    //     } else if (by==="user"){
    //         query = () => api.searchByUsername(search);
    //     } else {
    //         query = () => api.searchByPlaylist(search);
    //     }
    //     console.log(query);
    //     query().then((response) => {
    //         if (response.status === 200) {
    //             console.log("ID PAIRS RESPONSE");
    //             console.log(response);
    //             let pairsArray = response.data.playlists;
    //             storeReducer({
    //                 type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
    //                 payload: {
    //                     listsData: pairsArray,
    //                 },
    //             });
    //         } else {
    //             console.log("API FAILED TO GET THE LIST PAIRS");
    //         }
    //     });
    // };

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

    const publishPlaylist = function () {
        let id = storeState.currentListId;
        api.publishPlaylist(id).then((res) => {
            if (res.status === 200) {
                let playlists = [...storeState.currentlyLoadedLists].map(
                    (x) => {
                        if (x._id == id) {
                            x.published = true;
                        }
                        return x;
                    }
                );
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        listsData: playlists,
                    },
                });
            }
        });
    };

    //reretrieve the entire playlists;
    //TODO: elegant
    const reloadLists = function () {
        let req;
        if (storeState.currentScreen == CurrentScreen.HOME) {
            req = () => api.getUserLists(storeState.searchQuery);
        } else if (storeState.currentScreen == CurrentScreen.PLAYLISTS) {
            req = () => api.searchByPlaylist(storeState.searchQuery);
        } else {
            req = () => api.searchByUsername(storeState.searchQuery);
        }
        req().then((res) => {
            if (res.status === 200) {
                console.log("PLAYLISTS RESPONSE IS");
                console.log(res.data.playlists);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        listsData: res.data.playlists,
                    },
                });
            }
        });
    };

    const duplicateList = function () {
        let id = storeState.currentListId;
        api.duplicateList(id).then((res) => {
            if (res.status === 201) {
                reloadLists();
            }
        });
    };

    // // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    const _moveSong = function (start: number, end: number) {
        let id = storeState.currentListId;
        api.updatePlaylistById(id, {
            type: "MOVE",
            d0: start,
            d1: end,
        }).then((res) => {
            if (res.status === 200) {
                if (storeState.currentList == null) return;
                let playlist = [...storeState.currentList];
                let t = playlist.splice(start, 1);
                playlist.splice(end, 0, t[0]);

                console.log("before");
                console.log(storeState.currentList);
                console.log("after");
                console.log(playlist);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        listId: id,
                        listData: playlist,
                    },
                });
            }
        });
    };

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

    const _editSong = function (index: number, ndata: Song) {
        let listid = storeState.currentListId;
        api.updatePlaylistById(listid, {
            type: DeltaType.EDIT,
            d0: index,
            d1: ndata,
        }).then((res) => {
            if (storeState.currentList === null) return;
            if (res.status === 200) {
                //TODO: maybe errors?
                let list = [...storeState.currentList];
                list[index] = ndata;
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

    const moveSong = (start: number, end: number) => {
        if (storeState.currentList === null) {
            return;
        }
        tps.addTransaction(
            new MoveSongTransaction(
                _moveSong,
                _moveSong,
                storeState.currentListId,
                start,
                end
            )
        );
    };

    const editSong = (index: number, ndata: Song) => {
        if (storeState.currentList === null) return;
        let id = storeState.currentListId;
        let odata = storeState.currentList[index];
        tps.addTransaction(
            new EditSongTransaction(
                _editSong,
                _editSong,
                id,
                index,
                odata,
                ndata
            )
        );
    };

    const undo = function () {
        tps.undoTransaction();
    };
    const redo = function () {
        tps.doTransaction();
    };
    const raiseModal = function (modal: CurrentModal, payload: any) {
        if (modal === CurrentModal.EDIT_SONG) {
            storeReducer({
                type: GlobalStoreActionType.EDIT_SONG,
                payload: payload, //expects a song and songIndex
            });
        } else {
            storeReducer({
                type: GlobalStoreActionType.HIDE_MODALS,
                payload: {},
            });
        }
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

    let resetState = function () {
        storeReducer({
            type: GlobalStoreActionType.RESET,
            payload: null,
        });
    };

    const getComments = () => {
        return api.getComments(storeState.currentListId);
    };

    const postComment = (comment: string) => {
        alert("sending the comment " + comment);
        return api.postComment(storeState.currentListId, comment);
    };

    const playSong = async (
        id: number,
        list: Song[],
        name: string,
        ind: number
    ) => {
        if (id !== storeState.currentPlayingListId) {
            api.listenToList(id).then((res) => {
                let loadedLists = storeState.currentlyLoadedLists.map((x) => {
                    if (x._id === id) {
                        x.listens++;
                    }

                    return x;
                });

                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYING,
                    payload: {
                        list: list,
                        index: ind,
                        id: id,
                        name: name,
                        lists: loadedLists,
                    },
                });
            });
        } else {
            storeReducer({
                type: GlobalStoreActionType.SET_PLAYING,
                payload: {
                    list: list,
                    index: ind,
                    id: id,
                    name: name,
                },
            });
        }
    };

    const likePlaylist = (id: number, liked: boolean) => {
        api.likePlaylist(id, liked).then((res) => {
            if (res.status === 200) {
                let lists = storeState.currentlyLoadedLists.map((x) => {
                    if (x._id == id) {
                        if (liked) {
                            x.userLiked = 1;
                        } else {
                            x.userDisliked = 1;
                        }
                    }
                    return x;
                });
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        listsData: lists,
                    },
                });
            }
        });
    };

    const changeScreen = (screen: CurrentScreen) => {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SCREEN,
            payload: {
                screen: screen,
            },
        });
    };

    const changeQuery = (query: string) => {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SEARCH,
            payload: {
                query,
            },
        });
    };

    const changeSortOrder = (m: SortOrder) => {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_ORDER,
            payload: {
                order: m,
            },
        });
    };

    const playId = (id: number) => {
        api.getPlaylistById(id).then((res) => {
            playSong(
                res.data.listinfo._id,
                res.data.playlist,
                res.data.listinfo.name,
                0
            );
        });
    };

    let store: Store = {
        store: storeState,
        changeListName: changeListName,
        closeCurrentList: closeCurrentList,
        createNewList: createNewList,
        // loadListsData: loadListsData,
        reloadLists: reloadLists,
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
        publishPlaylist: publishPlaylist,
        duplicateList: duplicateList,
        moveSong: moveSong,
        raiseModal: raiseModal,
        editSong: editSong,
        getComments: getComments,
        postComment: postComment,
        playSong: playSong,
        likePlaylist: likePlaylist,
        changeQuery: changeQuery,
        changeScreen: changeScreen,
        changeSortOrder: changeSortOrder,
        resetState: resetState,
        playId: playId,
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
