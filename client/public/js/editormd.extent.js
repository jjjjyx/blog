editormd.emoji.path = "http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/";
const markedRenderer = editormd.markedRenderer;
editormd.markedRenderer = function(markdownToC, options) {
    let render = markedRenderer(markdownToC, options);
    render.image = function(e, t, n) {
        t = t ? ' alt="' + t + '"' : "", n = n || "";
        let o = this.options.xhtml ? "/>" : ">";
        return `<div class="image-package${(n||t)?' img-title':''}">
            <img src="${e}" ${t} ${o}<br${o}
            <div class="image-caption">${n}</div>
            </div>
        `;
    }
    return render
}
