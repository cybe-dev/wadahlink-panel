import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ReactComponent as Check } from "../svg/check.svg";
const BigLoading = forwardRef((props, ref) => {
  const [hide, setHide] = useState(true);
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setHide(false);
    }
  }, [show]);

  useEffect(() => {
    let timeout;
    if (hide) {
      timeout = setTimeout(() => {
        setShow(false);
        setSuccess(false);
      }, 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hide]);

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => {
        setHide(true);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [success]);

  const hiding = () => {
    setHide(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
      },
      hide: hiding,
      success: () => {
        setSuccess(true);
      },
    }),
    []
  );

  if (!show) return null;

  return (
    <div
      className={
        "bg-white-400 fixed top-0 left-0 h-screen w-full z-50 flex justify-center items-center transition duration-500 " +
        (hide ? "bg-opacity-0 opacity-0" : "bg-opacity-60 opacity-100")
      }
    >
      <div className="w-32 h-32 rounded-full flex justify-center items-center overflow-hidden relative">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          className={
            "transition duration-500 absolute top-0 left-0 w-full h-full bg-green-100 flex justify-center items-center text-white-100 " +
            (success ? "bg-opacity-100" : "bg-opacity-0")
          }
        >
          <div
            className={
              "transition duration-500 transform w-full h-full flex justify-center items-center " +
              (!success ? "-translate-y-full" : "translate-y-0")
            }
          >
            <Check className="w-20 h-20" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default BigLoading;
