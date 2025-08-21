import type {Request,Response,NextFunction} from "express"



const errorHandler = (err:Error,  req:Request, res:Response,next:NextFunction) =>{
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode)

  res.json({
    message:err.message,
   
  })
}

export default errorHandler;




