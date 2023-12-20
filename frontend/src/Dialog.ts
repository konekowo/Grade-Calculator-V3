export class Dialog {
    public constructor(HTMLcontent:string) {
        let dialog = document.createElement("div");
        dialog.style.width = "40vw";
        dialog.style.height = "50vh";
        dialog.style.position = "absolute";
        dialog.style.top = "50vh";
        dialog.style.left = "50vw";
        dialog.style.borderRadius = "5px";
        dialog.style.backgroundColor = "rgb(47,39,79)";
        dialog.style.boxShadow = "0px 0px 20px black";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.transformOrigin = "top left";
        dialog.style.scale = "0.7";
        dialog.style.opacity = "0";
        dialog.style.transition = "0.5s scale, 0.5s opacity";
        dialog.style.zIndex = "300";
        dialog.innerHTML = HTMLcontent;
        document.body.appendChild(dialog);
        setTimeout(()=> {
            dialog.style.scale = "1";
            dialog.style.opacity = "1";
        },1);
    }

}