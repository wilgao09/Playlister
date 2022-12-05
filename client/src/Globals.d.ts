declare module "*.module.css";
declare module "*.css";

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
