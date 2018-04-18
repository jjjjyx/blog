// "use strict";
// function NotFoundError(code, error) {
//     Error.call(this, typeof error === "undefined" ? undefined : error.message);
//     Error.captureStackTrace(this, this.constructor);
//     this.name = "NotFoundError";
//     this.message = typeof error === "undefined" ? undefined : error.message;
//     this.code = typeof code === "undefined" ? "404" : code;
//     this.status = 404;
//     this.inner = error;
// }
//
// class NotFoundError extends Error {
//     constructor(code, error){
//         super();
//         this.name = "NotFoundError";
//         this.message = typeof error === "undefined" ? undefined : error.message;
//         this.code = typeof code === "undefined" ? "404" : code;
//         this.status = 404;
//         this.inner = error;
//     }
// }
//
//
//
// module.exports = NotFoundError;