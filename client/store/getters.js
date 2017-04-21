
// export const count = state => state.count;

 export const count = state => state.count;
 export const isSidebarShow = state => state.isSidebarShow;
 export const contentHeight = state => state.contentHeight;
 export const autoHeight = state => {
     let height = state.contentHeight==='auto'?state.contentHeight:(state.contentHeight+'px')
     return {
         height
     }
 };
