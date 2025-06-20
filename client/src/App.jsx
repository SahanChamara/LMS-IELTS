import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppRoutes from "./routes/appRoute";
import { useAppDispatch, useAppSelector } from "./redux/store-config/store";
import { useEffect, useState } from "react";
import { refreshTokenAPI } from "./redux/features/authSlice";
import Layout from "./components/Layout";


/* const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const {isAuthenticated } = useAppSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(!initialized && !isAuthenticated){
      console.log("app file useeffect",isAuthenticated);
      
      dispatch(refreshTokenAPI()).unwrap().finally(() => setInitialized(true));
    }    
  }, [dispatch, initialized, isAuthenticated]);

  return children;
}; */


function App() {
  return (
    //<AuthInitializer>
      <Router>
        <AppRoutes />
      </Router>
    //</AuthInitializer>
  );
}

export default App;
