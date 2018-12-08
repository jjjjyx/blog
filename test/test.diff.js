var jsdiff = require('diff');

var one = `
Parameters:

oldFileName : String to be output in the filename section of the patch for the removals
newFileName : String to be output in the filename section of the patch for the additions
oldStr : Original string value
newStr : New string value
oldHeader : Additional information to include in the old file header
newHeader : Additional information to include in the new file header
options : An object with options. Currently, only context is supported and describes how many lines of context should be included.
`;
var other = `
Parameters:

oldFileName : String to be output in the filename section of the patch for the removals
newFileName : String to be output in the filename section of the patch for the additions
oldStr : Origffl string value
newStr : New string value
oldHeader : Additionassl information to include in the old file header
newHeader : Additional information to include in the new file header
options : An object with options. Currently, only context is supported and describes how many lines of context should be included.`;

var diff = jsdiff.structuredPatch('', '', one, other, '', '', {context: 1});
let str = `diff: old_post_content new_post_content
===================================================================
--- old_post_content
+++ new_post_content
`
// ret.push('');
// ret.push('===================================================================');
// ret.push('--- old_post_content');
// ret.push('+++ new_post_content');

for (let i = 0; i < diff.hunks.length; i++) {
    const hunk = diff.hunks[i];
    str +=`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@ ${hunk.lines.join('\n')}
`
}


console.log(str)
