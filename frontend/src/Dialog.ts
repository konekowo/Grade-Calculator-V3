export class Dialog {

    private dialogElem: HTMLDivElement;
    private createTime: number;
    private isOpened: boolean = false;
    public constructor(HTMLcontent:string, autoOpen:boolean) {
        this.dialogElem = document.createElement("div");
        this.dialogElem.style.position = "absolute";
        this.dialogElem.style.top = "50vh";
        this.dialogElem.style.left = "50vw";
        this.dialogElem.style.minWidth = "500px";
        this.dialogElem.style.paddingBottom = "30px";
        this.dialogElem.style.borderRadius = "5px";
        this.dialogElem.style.backgroundColor = "rgb(47,39,79)";
        this.dialogElem.style.boxShadow = "0px 0px 20px black";
        this.dialogElem.style.transform = "translate(-50%, -50%)";
        this.dialogElem.style.transformOrigin = "top left";
        this.dialogElem.style.scale = "0.7";
        this.dialogElem.style.opacity = "0";
        this.dialogElem.style.transition = "0.5s scale, 0.5s opacity";
        this.dialogElem.style.zIndex = "300";
        this.dialogElem.innerHTML = HTMLcontent;
        document.body.appendChild(this.dialogElem);
        this.createTime = Date.now();
        if (autoOpen){
            setTimeout(()=> {
                this.dialogElem.style.scale = "1";
                this.dialogElem.style.opacity = "1";
                this.isOpened = true;
            },1);
        }
    }

    public OpenDialog() {
        if (!this.isOpened){
            if (Date.now() - this.createTime > 1){
                this.dialogElem.style.scale = "1";
                this.dialogElem.style.opacity = "1";
                this.isOpened = true;
            }
            else {
                setTimeout(()=> {
                    this.dialogElem.style.scale = "1";
                    this.dialogElem.style.opacity = "1";
                    this.isOpened = true;
                },1);
            }
        }
    }

    public CloseDialog() {
        if (this.isOpened){
            this.dialogElem.style.scale = "0.7";
            this.dialogElem.style.opacity = "0";
        }
    }

    public GetIsOpened() {
        return this.isOpened;
    }

    public GetHtmlDiv() {
        return this.dialogElem;
    }

}