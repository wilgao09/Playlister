export default class EditSongTransaction implements Transaction {
    dofn: any;
    undofn: any;
    start: number;
    end: number;
    listid: number;
    constructor(
        dofn: any,
        undofn: any,
        listid: number,
        start: number,
        end: number
    ) {
        this.dofn = dofn;
        this.undofn = undofn;
        this.start = start;
        this.listid = listid;
        this.end = end;
    }

    doTransaction() {
        this.dofn(this.start, this.end);
    }
    undoTransaction() {
        this.dofn(this.end, this.start);
    }
}
