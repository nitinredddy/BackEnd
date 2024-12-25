const asyncHandler = (reqHandler)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next)).catch((error)=>next(error))
    }
}

export {asyncHandler}









// const asyncHandler = (fn)=>(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }