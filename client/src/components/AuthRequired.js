import { useContext } from "react";
import {Navigate} from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({children}) {
  
  const auth = useContext(AuthContext);
  
  // 인증되지 않은 유저인 경우
  if (!auth.user) {
    return <Navigate to="/login" replace={true} />
  }

  return children;
}