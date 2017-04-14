editormd.emoji.path = "http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/";
const markedRenderer = editormd.markedRenderer;



editormd.markedRenderer = function(markdownToC, options) {
    let render = markedRenderer(markdownToC, options);
    render.image = function(e, t, n) {
        t = t ? ' alt="' + t + '"' : "", n = n || "";
        let o = this.options.xhtml ? "/>" : ">";
        if(n||t){
            return `
            <figure data-am-widget="figure" class="am am-figure am-figure-default " data-am-figure="{  pureview: 'true' }">
                 <img src="${e}" data-rel="${e}" ${t} ${o}
                 <figcaption class="am-figure-capition-btm">
                      ${n}
                 </figcaption>
            </figure>
            `
        }else{
            return `<img src="${e}" ${t} ${o}`
        }

    }
    return render
}
