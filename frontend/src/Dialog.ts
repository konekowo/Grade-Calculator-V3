export class Dialog {

    protected dialogElem: HTMLDivElement;
    protected createTime: number;
    protected isOpened: boolean = false;
    protected static zIndex = 300;
    public constructor(HTMLcontent:string, autoOpen:boolean, dontAppend?: boolean) {
        if (dontAppend == null){
            dontAppend = false;
        }
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
        this.dialogElem.style.zIndex = Dialog.zIndex.toString();
        this.dialogElem.innerHTML = HTMLcontent;
        this.dialogElem.style.display = "none";
        if (!dontAppend){
            document.body.appendChild(this.dialogElem);
        }
        Dialog.zIndex++;
        this.createTime = Date.now();
        if (autoOpen){
            this.OpenDialog();
        }
    }

    public OpenDialog() {
        if (!this.isOpened){
            this.dialogElem.style.display = "block";
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
            let buttons = this.dialogElem.getElementsByTagName("button");
            if (buttons){
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].setAttribute("disabled", "");
                }
            }
            this.dialogElem.style.scale = "0.7";
            this.dialogElem.style.opacity = "0";
            setTimeout(()=> {
                if (!this.isOpened)
                    this.dialogElem.style.display = "none";
            },500);

            this.isOpened = false;
        }
    }

    public GetIsOpened() {
        return this.isOpened;
    }

    public GetHtmlDiv() {
        return this.dialogElem;
    }

    public Destroy() {
        this.dialogElem.remove();
        Dialog.zIndex--;
    }

    public DestroyWithAnim(){
        this.CloseDialog();
        setTimeout(() => {
            this.dialogElem.remove();
            Dialog.zIndex--;
        }, 500);
    }

}