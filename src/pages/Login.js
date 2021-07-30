import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Container from "../components/AuthPages/Container";
import Heading from "../components/AuthPages/Heading";
import Button from "../components/Button";
import Loader from "../components/Loader";
import TextInput from "../components/TextInput";
import service from "../service";
import { ReactComponent as Logo } from "../svg/logo.svg";

export default function Login() {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  const { register, handleSubmit } = useForm();
  const login = useSelector((state) => state.auth._proceedLogin);
  const _proceedLogin = ({ username, password }) => {
    setLoading(true);
    service
      .get("/api/auth/get-token", {
        params: {
          username,
          password,
        },
      })
      .then((response) => {
        setLoading(false);
        const {
          token: { token },
          id,
        } = response.data;

        login({ token, id });
        history.replace(from);
      })
      .catch((e) => {
        setLoading(false);
        if (e.response?.status === 400 || e.response?.status === 404) {
          setFail(true);
        }
      });
  };
  return (
    <Container className="block lg:flex justify-center items-center">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="pt-20 pb-8 flex justify-center lg:hidden">
        <Logo className="w-1/3 h-auto" color="#000" />
      </div>
      <div className="flex w-auto m-5 md:mx-auto md:w-2/3 lg:w-3/4 xl:w-3/5 bg-white-100 rounded-md p-5  mb-20 lg:mb-5">
        <div className="w-1/2 mr-12 justify-center items-center hidden lg:flex">
          <Logo className="w-64 h-auto" color="#000" />
        </div>
        <div className="flex-1 p-3 lg:p-5 lg:pl-8 border-l-0 lg:border-l border-white-300">
          <Heading title="Login" subtitle="Masuk ke akun Wadah Link anda" />
          <form
            className="mt-10 lg:mt-16"
            onSubmit={handleSubmit(_proceedLogin)}
          >
            {fail && (
              <Alert className="text-center mb-4">
                Username atau password salah
              </Alert>
            )}
            <TextInput
              type="text"
              containerClassName="mb-4"
              placeholder="Username/Email"
              {...register("username", { required: true })}
            />
            <TextInput
              type="password"
              containerClassName="mb-4"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader className="bg-white-100" /> : "Masuk"}
            </Button>
          </form>

          <div className="text-center mt-10">
            Belum punya akun? <br /> <Link to="/register">Buat akun baru</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
