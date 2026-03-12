export const allowDoctor = (req,res,next)=>{

   if(req.user.role !== "doctor"){
      return res.status(403).json({
         message:"Access denied. Doctors only."
      });
   }

   next();
}

export const allowHospital = (req,res,next)=>{

  if(req.user.role !== "hospital"){
    return res.status(403).json({message:"Hospital access only"});
  }

  next();
}

export const allowAdmin = (req,res,next)=>{

  if(req.user.role !== "admin"){
    return res.status(403).json({message:"Admin access only"});
  }

  next();
}