export default class MoveSongTransaction implements Transaction {
    dofn: any;
    undofn: any;
    index: number;
    odata: Song;
    ndata: Song;
    listid: number;
    constructor(
        dofn: any,
        undofn: any,
        listid: number,
        index: number,
        odata: Song,
        ndata: Song
    ) {
        this.dofn = dofn;
        this.undofn = undofn;
        this.listid = listid;
        this.index = index;
        this.odata = odata;
        this.ndata = ndata;
    }

    doTransaction() {
        this.dofn(this.index, this.ndata);
    }
    undoTransaction() {
        this.undofn(this.index, this.odata);
    }
}
