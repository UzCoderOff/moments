import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  Login,
  Singup,
  Home,
  TermsOfService,
  PrivacyPolicy,
  Profile,
  Loading,
  EditProfile,
  Saved,
  Explore
} from "./components";
import { auth } from "./firebase/config";
import ExplorePople from "./components/explore/ExplorePople";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signup"
          element={user ? <Navigate to={"/"} /> : <Singup />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route path="/:username" element={ user ? <Profile /> : <Navigate to={'/login'}/> } />
        <Route path="/:username/saved" element={ user ? <Saved/> : <Navigate to={ '/login'}/> } />
        <Route path="/accounts/edit" element={user ? <EditProfile/> : <Navigate to={ '/login' }/>} />
        <Route path="/explore" element={user ? <Explore/> : <Navigate to={ '/login' }/>} />
        <Route path="/explore/people" element={user ? <ExplorePople/> : <Navigate to={ '/login' }/>} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
