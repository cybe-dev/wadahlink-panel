import { Fragment, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Button from "../components/Button";
import service from "../service";
import { logout, replace } from "../redux/reducers/auth";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";
import Card from "../components/Card";
import TextInput from "../components/TextInput";
import { ReactComponent as Pencil } from "../svg/pencil.svg";
import { ReactComponent as Close } from "../svg/close.svg";
import { useForm } from "react-hook-form";
import { baseURL } from "../config";
import { removeAll } from "../redux/reducers/data";
import Modal from "../components/Modal";
import BigLoading from "../components/BigLoading";

const isFile = (input) => "File" in window && input instanceof File;

export default function Setting() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const _modalRef = useRef();
  const _pwLoading = useRef();
  const [editProfile, setEditProfile] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      photo: "",
      fullname: "",
    },
  });
  const {
    register: pwRegister,
    handleSubmit: pwSubmit,
    reset: pwReset,
  } = useForm();
  const _inputPhoto = useRef();

  const [loading, setLoading] = useState(false);
  const [loadingSetting, setLoadingSetting] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies();
  const auth = useSelector((state) => state.auth);

  const _toggleEditProfile = () => {
    setEditProfile((value) => !value);
  };

  const _logout = () => {
    setLoading(true);
    service
      .delete("/api/auth/logout")
      .then((response) => {
        removeCookies("id", {
          path: "/",
        });
        removeCookies("token", {
          path: "/",
        });
        setLoading(false);

        dispatch(removeAll());
        dispatch(logout());

        history.replace("/login", { from: location });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const _changePassword = ({ new_password, old_password }) => {
    _pwLoading.current.show();
    service
      .put("/api/auth/change-password", {
        old_password,
        new_password,
      })
      .then((response) => {
        pwReset({ old_password: "", new_password: "" });
        _pwLoading.current.success();
        _modalRef.current.hide();
      })
      .catch((e) => {
        _pwLoading.current.hide();
      });
  };

  const _saveSetting = ({ fullname, photo }) => {
    setLoadingSetting(true);
    let payload;
    payload = {
      fullname,
    };

    if (isFile(photo)) {
      payload = new FormData();
      payload.append("fullname", fullname);
      payload.append("photo", photo);
    }
    service
      .put(`/api/user/${auth.id}`, payload)
      .then((response) => {
        setLoadingSetting(false);
        const { fullname, photo } = response.data;

        dispatch(replace({ field: "fullname", value: fullname }));
        dispatch(replace({ field: "photo", value: photo }));
        _toggleEditProfile();
      })
      .catch((e) => {
        setLoadingSetting(false);
      });
  };

  useEffect(() => {
    if (!editProfile) {
      reset({ fullname: auth.fullname, photo: auth.photo || "" });
    }
  }, [editProfile, auth.fullname, auth.photo, reset]);
  return (
    <Fragment>
      <Helmet>
        <title>Pengaturan</title>
      </Helmet>
      <Card className="mb-5">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl font-bold cabin text-black-100">
            Informasi
          </span>
          <button
            type="button"
            onClick={() => _toggleEditProfile()}
            className="text-white-400 hover:text-black-200 w-8 h-8 flex justify-end items-center"
          >
            {editProfile ? (
              <Close width={16} height={16} />
            ) : (
              <Pencil width={16} height={16} />
            )}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-start">
          <div className="w-1/2 md:w-1/3 lg:w-1/5 mx-auto flex justify-center items-start">
            <div className="bg-white-400 w-full w-1-1 h-auto rounded-sm group cursor-pointer">
              {watch("photo") && (
                <img
                  src={
                    isFile(watch("photo"))
                      ? URL.createObjectURL(watch("photo"))
                      : baseURL + "/" + watch("photo")
                  }
                  alt="profile pic"
                  className={
                    "w-full h-full absolute top-0 left-0 rounded-sm object-cover"
                  }
                />
              )}
              {editProfile && (
                <button
                  type="button"
                  className="absolute top-0 right-0 p-2 block bg-black-100 m-1 rounded bg-opacity-50 opacity-50 group-hover:bg-opacity-60 group-hover:opacity-100 text-white-100 transition-all duration-300"
                  onClick={() => _inputPhoto.current.click()}
                >
                  <Pencil width={16} height={16} />
                </button>
              )}
            </div>
          </div>
          <form
            className="flex-1 w-full lg:w-auto pl-0 lg:pl-8 mt-5 lg:mt-0"
            onSubmit={handleSubmit(_saveSetting)}
          >
            <input
              type="file"
              className="hidden"
              ref={_inputPhoto}
              multiple={false}
              accept=".jpg,.png"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setValue("photo", e.target.files[0]);
                }
              }}
            />
            <TextInput
              type="text"
              readOnly={editProfile === false}
              label="Nama Lengkap"
              containerClassName="mb-4"
              {...register("fullname", { required: true })}
            />
            <TextInput
              type="text"
              readOnly
              defaultValue={auth.username}
              label="Username"
              containerClassName="mb-4"
            />
            <TextInput
              type="text"
              readOnly
              defaultValue={auth.email}
              label="Email"
              containerClassName="mb-4"
            />
            <div className="flex">
              {editProfile && (
                <Button
                  className="w-32 ml-auto"
                  classBackground="bg-black-200 hover:bg-black-100"
                  type="submit"
                >
                  {loadingSetting ? (
                    <Loader className="bg-white-100" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
      <Card className="mb-5 py-5">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl font-bold cabin text-black-100">
            Keamanan
          </span>
        </div>
        <button type="button" onClick={() => _modalRef.current.show()}>
          &raquo; Ganti Password
        </button>
      </Card>
      <Button type="button" className="w-full" onClick={() => _logout()}>
        {loading ? <Loader className="bg-white-100" /> : "Keluar"}
      </Button>
      <Modal title="Ganti Password" ref={_modalRef}>
        <form onSubmit={pwSubmit(_changePassword)}>
          <TextInput
            type="password"
            label="Password Lama"
            containerClassName="mb-4"
            {...pwRegister("old_password", { required: true })}
          />
          <TextInput
            type="password"
            label="Password Baru"
            containerClassName="mb-4"
            {...pwRegister("new_password", { required: true })}
          />
          <Button type="submit" className="w-full">
            Simpan
          </Button>
        </form>
      </Modal>
      <BigLoading ref={_pwLoading} />
    </Fragment>
  );
}
