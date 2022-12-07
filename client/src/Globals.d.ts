// import { CurrentScreen } from "./store";

declare module "*.module.css";
declare module "*.css";

interface SongList {
    _id: number;
    name: string;
    listens: number;
    published: boolean; //TODO: create a publishedDate for backend and frontend
    createdAt: Date; // maybe repurpose this?
    updatedAt: Date;
    owner: string;
    upvotes: number;
    downvotes: number;
    userLiked: number; //TODO: inefficiency, root
    userDisliked: number;
}

interface Song {
    title: string;
    artist: string;
    youTubeId: string;
}

interface Delta {
    type: string;
    d0: number;
    d1: number | Song;
}

interface User {
    firstName: string;
    lastName: string;
    username: string;
}

//TODO: add guest capabilities here
interface AuthState {
    user: User | null;
    loggedIn: boolean;
    failedLogin: boolean;
    failedRegister: boolean;
    isGuest: boolean;
    // getLoggedIn: () => void;
}

interface Auth {
    auth: AuthState;
    getLoggedIn: () => void;
    registerUser: (
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        passwordVerify: string
    ) => void;
    loginUser: (email: string, password: string) => void;
    logoutUser: () => void;
    getUserInitials: () => string;
    resetFailure: () => void;
    popupError: (e: string) => void;
    closeError: () => void;
    getError: () => string;
}

interface StoreState {
    currentModal: CurrentModal;
    currentlyLoadedLists: SongList[];
    currentListId: number;
    currentList: Song[] | null;
    searchQuery: string;
    currentScreen: CurrentScreen;
    currentPlayerTab: CurrentTab;
    sortOrder: SortOrder;
    listNameToEdit: number;
    currentPlayingListId: number;
    currentPlayingList: Song[];
    currentPlayingSongIndex: number;
    currentPlayingListName: string;
    currentSongIndex: number;
    currentSong: Song | null;
    listToDelete: number;
}

interface Store {
    store: StoreState;
    changeListName: (id: number, newName: string) => Promise;
    closeCurrentList: () => void;
    createNewList: () => void;
    // loadListsData: (by: string, search: string) => void;
    reloadLists: () => void;
    deleteList: (id: number) => void;
    hideModals: () => void;
    showEditSongModal: (songIndex: number, songToEdit: Song) => void;
    showRemoveSongModal: (songIndex: number, songToRemove: Song) => void;
    isDeleteListModalOpen: () => boolean;
    isEditSongModalOpen: () => boolean;
    isRemoveSongModalOpen: () => boolean;
    isModalOpen: () => boolean;
    setCurrentList: (id: number) => void;
    getPlaylistSize: () => number;
    createSong: (index: number, song: Song) => void;
    addNewSong: (song: Song) => void;
    removeSong: (index: number) => void;
    undo: () => void;
    redo: () => void;
    duplicateList: () => void;
    publishPlaylist: () => void;
    moveSong: (start: number, end: number) => void;
    raiseModal: (modal: CurrentModal, payload: any) => void;
    editSong: (index: number, ndata: Song) => void;
    getComments: () => Promise;
    postComment: (comment: string) => Promise;
    playSong: (id: number, list: Song[], name: string, ind: number) => void;
    likePlaylist: (id: number, liked: boolean) => void;
    changeQuery: (query: string) => void;
    changeScreen: (screen: CurrentScreen) => void;
    changeSortOrder: (m: SortOrder) => void;
    resetState: () => void;
    playId: (id: number) => void;
}

interface Transaction {
    doTransaction: () => void;
    undoTransaction: () => void;
}

// type tsTPS = {
//     transactions: Transaction[];
//     numTransactions: number;
//     mostRecentTransaction: number;
//     performingDo: Boolean;
//     performingUndo: Boolean;
//     isPerformingDo: () => Boolean;
//     isPerformingUndo: () => Boolean;
//     getSize: () => number;
//     getRedoSize: () => number;
//     getUndoSize: () => number;
//     hasTransactionToUndo: () => Boolean;
//     addTransaction: (Transaction) => void;
//     doTransaction: () => void;
//     undoTransaction: () => void;
//     clearAllTransactions: () => void;
//     tostring: () => string;
// };
