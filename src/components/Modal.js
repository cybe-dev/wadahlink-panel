import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ReactComponent as Close } from "../svg/close.svg";

const Modal = forwardRef(({ title, children }, ref) => {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(true);

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
      }, 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hide]);

  useImperativeHandle(
    ref,
    () => ({
      hide: () => {
        setHide(true);
      },
      show: () => {
        setShow(true);
      },
    }),
    []
  );
  return (
    <Fragment>
      <button
        type="button"
        className={
          "bg-black-100 transition-all duration-500 fixed top-0 left-0 w-full h-full z-30 cursor-default " +
          (show ? "block " : "hidden ") +
          (hide ? "opacity-0" : "opacity-75")
        }
        onClick={() => setHide(true)}
      />
      <div
        className={
          "pointer-events-none fixed top-0 left-0 w-full h-full z-30 justify-center items-center transform transition-all duration-500 " +
          (show ? "flex " : "hidden ") +
          (hide ? "-translate-y-full" : "-translate-y-0")
        }
      >
        <div className="pointer-events-auto w-full m-5 md:w-1/2 lg:w-2/5 xl:w-2/6 bg-white-100 rounded-md p-5 md:p-8">
          <h3 className="cabin font-bold text-lg border-b border-white-300 pb-5 mb-5 flex items-center justify-between">
            {title}{" "}
            <button
              type="button"
              onClick={() => setHide(true)}
              className="w-8 h-8 flex justify-end items-center"
            >
              <Close width={12} height={12} />
            </button>
          </h3>
          {children}
        </div>
      </div>
    </Fragment>
  );
});

export default Modal;
