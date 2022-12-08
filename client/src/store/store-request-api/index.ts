/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from "axios";
//TODO: fix
const config = {
    apiPort: "4000",
    apiDomain: "localhost",
};
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: `http://${config.apiDomain}:${config.apiPort}/api`,
});

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (newListName: String) => {
    return api.post(`/playlist/`, {
        name: newListName,
    });
};
export const deletePlaylistById = (id: Number) => api.delete(`/playlist/${id}`);
export const getPlaylistById = (id: Number) => api.get(`/playlist/${id}`);
// export const getPlaylistPairs = () => api.get(`/playlistpairs/`);
export const getUserLists = (name?: string) =>
    api.get(`/playlist${name ? "?name=" + name : ""}`);

export const searchByUsername = (name: string) =>
    api.get(`/playlist/searchUser?name=${name}`);
export const searchByPlaylist = (name: string) =>
    api.get(`/playlist/searchPlaylist?name=${name}`);

export const updatePlaylistById = (id: Number, delta: Delta) => {
    return api.put(`/playlist/contents/${id}`, {
        // SPECIFY THE PAYLOAD
        delta: delta,
    });
};
export const renamePlaylist = (id: number, name: string) =>
    api.put(`/playlist/rename/${id}`, {
        name: name,
    });

export const publishPlaylist = (id: number) =>
    api.post(`/playlist/publish/${id}`);

export const duplicateList = (id: number) =>
    api.post(`/playlist/duplicate/${id}`);

export const getComments = (id: number) => api.get(`/playlist/comment/${id}`);

export const postComment = (id: number, comment: string) =>
    api.post(`/playlist/comment/${id}`, { comment: comment });

export const likePlaylist = (id: number, liked: boolean) =>
    api.post(`/playlist/like/${id}`, {
        liked: liked,
    });

export const listenToList = (id: number) =>
    api.post(`/playlist/userPlaying/${id}`);

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getUserLists,
    updatePlaylistById,
    renamePlaylist,
    publishPlaylist,
    duplicateList,
    searchByPlaylist,
    searchByUsername,
    getComments,
    postComment,
    likePlaylist,
    listenToList,
};

export default apis;
