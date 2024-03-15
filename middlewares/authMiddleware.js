import passport from "passport";
import "../config/passport.js";
export const checkAuth = passport.authenticate("jwt", { session: false });

export const isAdmin = (req, res, next) => {
  console.log("idher yolo " , req)
  
  if (req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: "Unauthorized: Admin access required" });
};
