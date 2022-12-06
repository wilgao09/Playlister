export default class CreateSongTransaction implements Transaction {
    dofn: any;
    undofn: any;
    index: number;
    listid: number;
    song: Song;
    constructor(
        dofn: any,
        undofn: any,
        listid: number,
        index: number,
        song: Song
    ) {
        this.dofn = dofn;
        this.undofn = undofn;
        this.index = index;
        this.listid = listid;
        this.song = song;
    }

    doTransaction() {
        this.dofn(this.index, this.song);
    }
    undoTransaction() {
        this.undofn(this.index);
    }
}
