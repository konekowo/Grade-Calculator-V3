import {Dialog} from "./Dialog";

export class DialogModal extends Dialog{

    private modal: HTMLDivElement;

    public constructor(HTMLcontent:string) {
        super(HTMLcontent, false);
        this.modal = document.createElement("div");
        this.modal.style.position = "absolute";
        this.modal.style.backgroundColor = "rgba(0,0,0,0)";
        this.modal.style.width = "100vw";
        this.modal.style.height = "100vh";
        this.modal.style.top = "0px";
        this.modal.style.left = "0px";
        this.modal.style.transition = "0.4s background-color";
        this.modal.style.display = "none";
        this.modal.style.zIndex = this.dialogElem.style.zIndex;
        this.dialogElem.remove();
        this.modal.appendChild(this.dialogElem);
        document.body.appendChild(this.modal);
    }

    public override OpenDialog() {
        super.OpenDialog();
        if (!this.isOpened){
            this.modal.style.display = "block";
            if (Date.now() - this.createTime > 1){
                this.modal.style.backgroundColor = "rgba(0,0,0,0.4)";
            }
            else {
                setTimeout(()=> {
                    this.modal.style.backgroundColor = "rgba(0,0,0,0.4)";;
                },1);
            }
        }
    }

    public override CloseDialog() {
        super.CloseDialog();
        if (this.dialogElem.style.opacity == "0"){
            this.modal.style.backgroundColor = "rgba(0,0,0,0)";
            setTimeout(() => {
                this.modal.style.display = "none";
            },500);
        }
    }

    public GetHtmlDivModal(): HTMLDivElement {
        return this.modal;
    }

    public override Destroy() {
        super.Destroy();
        this.modal.remove();
    }

    public override DestroyWithAnim() {
        this.CloseDialog();
        setTimeout(() => {
            this.modal.remove();
            Dialog.zIndex--;
        }, 500);
    }


}