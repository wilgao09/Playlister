# DB interfaces

In this project, we will have some special rules

-   All databases will have 3 tables/collections: auth, playlists, songs

    -   songs will be interned and immutable

    -   all songs will also have a ref counter associated with them

    -   the ref will be immutable

    -   if the ref is zero, it should be autocleaned

All databases must support the actions outlined in `db-interface.js`
