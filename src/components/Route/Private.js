import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect, Route } from "react-router-dom";
import { baseURL } from "../../config";
import { ReactComponent as Copy } from "../../svg/copy.svg";
import { ReactComponent as Logo } from "../../svg/mini-logo.svg";
import Container from "../Container";
import Navlink from "../Navlink";
import { LinkList, ProfileImage, UserFullname } from "../Preview";

const Template = ({ children }) => {
  const { link: links, design: designs } = useSelector((state) => state.data);
  const { fullname, username, photo } = useSelector((state) => state.auth);
  const _textRef = useRef();
  const [textarea, setTextarea] = useState(false);
  useEffect(() => {
    if (textarea) {
      _textRef.current.select();
      _textRef.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      setTextarea(false);
    }
  }, [textarea]);
  return (
    <div className="min-h-screen bg-white-200">
      <div className="h-16 bg-white-100 fixed top-0 left-0 w-full flex justify-center items-center z-20 shadow-sm">
        <Container className="flex justify-between items-center">
          <Link to="/">
            <Logo className="h-8 w-auto" color="#000" />
          </Link>
          <div className="flex items-center">
            <a
              href={`${baseURL}/${username}`}
              target="_blank"
              className="text-black-100 border-b-2 border-white-400 border-dashed"
            >
              /{username}
            </a>
            <textarea
              className={
                "opacity-0 absolute top-0 left-0 " +
                (textarea ? "block" : "hidden")
              }
              readOnly
              ref={(ref) => (_textRef.current = ref)}
              value={`${baseURL}/${username}`}
            />
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-end ml-2"
              onClick={() => {
                setTextarea(true);
              }}
            >
              <Copy width={16} height={16} />
            </button>
          </div>
        </Container>
      </div>
      <div className="flex justify-center pb-12">
        <Container className="flex">
          <div className="lg:w-1/6 h-screen fixed pt-16 hidden lg:flex">
            <div className="w-full mt-12">
              <div className="w-9-16 w-full rounded-2xl bg-black-100 pointer-events-none sticky shadow-md">
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-2xl overflow-auto"
                  style={{
                    margin: "3%",
                    backgroundColor: designs.page_background || "#FFF",
                  }}
                >
                  {links.length < 1 ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <UserFullname>Belum ada link</UserFullname>
                    </div>
                  ) : (
                    <Fragment>
                      <ProfileImage url={photo} />
                      <UserFullname color={designs.name_color || "#333"}>
                        {fullname}
                      </UserFullname>
                      {links.map((item, index) => (
                        <LinkList
                          key={`${index}`}
                          color={designs.link_color || "#FFF"}
                          bgColor={designs.link_background || "#333"}
                        >
                          {item.name}
                        </LinkList>
                      ))}
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/6 h-screen mr-8 hidden lg:block">asdd</div>
          <div className="flex-1 pt-16 pl-0 lg:pl-8">
            <div className="mt-8 lg:mt-12 pl-0 lg:pl-8">
              <Navlink
                link={[
                  {
                    to: "/link",
                    value: "Link",
                  },
                  {
                    to: "/design",
                    value: "Desain",
                  },
                  {
                    to: "/setting",
                    value: "Pengaturan",
                  },
                ]}
              />
              {children}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default function Private({ children, ...rest }) {
  const auth = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.token ? (
          <Template>{children}</Template>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
