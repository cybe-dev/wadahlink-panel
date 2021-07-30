import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Container from "../components/AuthPages/Container";
import Heading from "../components/AuthPages/Heading";
import Button from "../components/Button";
import Loader from "../components/Loader";
import TextInput from "../components/TextInput";
import { errorMsg } from "../config";
import { useDebounce } from "../debounce";
import service from "../service";
import { ReactComponent as Logo } from "../svg/logo.svg";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const usernameRegex = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export default function Register() {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({});
  const _proceedLogin = useSelector((state) => state.auth._proceedLogin);
  const [loading, setLoading] = useState(false);
  const [loadingUsernameCheck, setLoadingUsernameCheck] = useState(false);
  const [loadingEmailCheck, setLoadingEmailCheck] = useState(false);
  const [errorOnCheck, setErrorOnCheck] = useState(false);

  const check = (type) => {
    return (text) => {
      setErrorOnCheck(true);
      if (
        (type === "username" && text.match(usernameRegex)) ||
        (type === "email" && text.match(emailRegex))
      ) {
        service
          .get("/api/user/check", {
            params: {
              username: type === "username" ? text : "",
              email: type === "email" ? text : "",
            },
          })
          .then((response) => {
            if (type === "username") {
              setLoadingUsernameCheck(false);
            } else {
              setLoadingEmailCheck(false);
            }
            setError(type, {
              type: "manual",
              message:
                (type === "username" ? "Username " : "Email ") +
                errorMsg.hasRegistered,
            });
            setErrorOnCheck(true);
          })
          .catch((e) => {
            if (type === "username") {
              setLoadingUsernameCheck(false);
            } else {
              setLoadingEmailCheck(false);
            }
            if (e.response?.status === 404) {
              setErrorOnCheck(false);
              clearErrors(type);
              setValue(type, text);
            }
          });
      } else {
        if (type === "username") {
          setLoadingUsernameCheck(false);
        } else {
          setLoadingEmailCheck(false);
        }
        setError(type, {
          type: "manual",
          message:
            (type === "username" ? "Username " : "Email ") + errorMsg.invalid,
        });
      }
    };
  };

  const debounceUsername = useCallback(useDebounce(check("username")), []);
  const debounceEmail = useCallback(useDebounce(check("email")), []);

  const _proceedRegister = ({ username, fullname, password, email }) => {
    setLoading(true);
    service
      .post("/api/auth/register", {
        username,
        fullname,
        password,
        email,
      })
      .then((response) => {
        setLoading(false);
        const {
          token: { token },
          id,
        } = response.data;

        _proceedLogin({ token, id });

        history.replace(from);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <Container>
      <Helmet>
        <title>Buat Akun Baru</title>
      </Helmet>
      <div className="pt-20 pb-8 flex justify-center">
        <Logo className="w-1/3 md:w-40 lg:w-52 h-auto" color="#000" />
      </div>
      <div className="w-auto md:w-2/3 lg:w-1/3 m-5 md:mx-auto bg-white-100 p-5 md:p-8 mb-20 rounded-md">
        <Heading title="Buat Akun Baru" subtitle="Buat akun Wadah Link anda" />
        <form className="mt-10" onSubmit={handleSubmit(_proceedRegister)}>
          <input
            type="hidden"
            {...register("username", {
              required: errorMsg.required,
              pattern: {
                value: usernameRegex,
                message: "Username " + errorMsg.invalid,
              },
            })}
          />
          <input
            type="hidden"
            {...register("email", {
              required: errorMsg.required,
              pattern: {
                value: emailRegex,
                message: "Email " + errorMsg.invalid,
              },
            })}
          />
          <TextInput
            containerClassName="mb-4"
            label="Username"
            type="text"
            error={errors.username?.message}
            left={() =>
              loadingUsernameCheck ? (
                <div className="flex items-center justify-center px-3">
                  <Loader className="bg-white-400" />
                </div>
              ) : null
            }
            onChange={(e) => {
              setValue("username", "");
              setLoadingUsernameCheck(true);
              debounceUsername(e.target.value);
            }}
          />
          <TextInput
            containerClassName="mb-4"
            label="Nama Lengkap"
            type="text"
            {...register("fullname", { required: errorMsg.required })}
            error={errors.fullname?.message}
          />
          <TextInput
            containerClassName="mb-4"
            label="Email"
            type="text"
            error={errors.email?.message}
            left={() =>
              loadingEmailCheck ? (
                <div className="flex items-center justify-center px-3">
                  <Loader className="bg-white-400" />
                </div>
              ) : null
            }
            onChange={(e) => {
              setValue("email", "");
              setLoadingEmailCheck(true);
              debounceEmail(e.target.value);
            }}
          />
          <TextInput
            containerClassName="mb-4"
            label="Password"
            type="password"
            {...register("password", { required: errorMsg.required })}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            disabled={
              loading ||
              loadingUsernameCheck ||
              loadingEmailCheck ||
              errorOnCheck
            }
            className="w-full"
          >
            {loading ? <Loader className="bg-white-100" /> : "Mendaftar"}
          </Button>
        </form>
        <div className="text-center mt-10">
          Sudah punya akun? <Link to="/login">Login</Link>
        </div>
      </div>
    </Container>
  );
}
