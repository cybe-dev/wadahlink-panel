import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Auth from "./components/Route/Auth";
import Private from "./components/Route/Private";
import Design from "./pages/Design";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Setting from "./pages/Setting";
import { login, logout, set, setProceedLogin } from "./redux/reducers/auth";
import { design, reset } from "./redux/reducers/data";
import service from "./service";

export default function App() {
  const [cookies, setCookies, removeCookies] = useCookies();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.token && cookies.id) {
      const { token, id } = cookies;
      dispatch(login({ token, id }));
    } else {
      setLoading(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (auth.token && auth.id) {
      service
        .get(`/api/auth/check-token`)
        .then((response) => {
          const {
            fullname,
            username,
            email,
            photo,
            design: designs,
            links,
          } = response.data;
          dispatch(set({ fullname, username, email, photo }));
          dispatch(reset({ data: links }));
          dispatch(design({ ...designs }));
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          if (e.response?.status === 401) {
            removeCookies("token", {
              path: "/",
            });
            removeCookies("id", {
              path: "/",
            });
            dispatch(logout());
          }
        });
    }
  }, [auth.id, auth.token]);

  useEffect(() => {
    dispatch(
      setProceedLogin(({ token, id }) => {
        setCookies("id", id, {
          path: "/",
        });
        setCookies("token", token, {
          path: "/",
        });
      })
    );
  }, [dispatch, setCookies]);

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter basename="/panel">
      <Switch>
        <Private path="/" exact>
          <Redirect to="/link" />
        </Private>
        <Private path="/setting" exact>
          <Setting />
        </Private>
        <Private path="/design" exact>
          <Design />
        </Private>
        <Private path="/link" exact>
          <Home />
        </Private>
        <Auth path="/register" exact>
          <Register />
        </Auth>
        <Auth path="/login" exact>
          <Login />
        </Auth>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
