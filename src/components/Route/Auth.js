import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

export default function Auth({ children, ...props }) {
  const auth = useSelector((state) => state.auth);

  return (
    <Route
      {...props}
      render={() => (auth.token ? <Redirect to="/" /> : children)}
    />
  );
}
