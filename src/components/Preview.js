import { baseURL } from "../config";

export const ProfileImage = ({ url }) => {
  if (!url) {
    return (
      <div
        className="bg-black-100 mx-auto rounded-full"
        style={{
          width: "5vw",
          height: "5vw",
          marginTop: "18%",
          marginBottom: "3%",
        }}
      />
    );
  }
  return (
    <img
      src={`${baseURL}/${url}`}
      alt="preview-profile-pic"
      className="bg-black-100 mx-auto rounded-full object-cover"
      style={{
        width: "5vw",
        height: "5vw",
        marginTop: "18%",
        marginBottom: "3%",
      }}
    />
  );
};

export const LinkList = ({ children, bgColor, color }) => {
  return (
    <div
      className="text-white-100 text-center"
      style={{
        marginTop: "3%",
        marginLeft: "10%",
        marginRight: "10%",
        padding: "4%",
        fontSize: "0.8vw",
        borderRadius: "0.5vw",
        backgroundColor: bgColor,
        color,
      }}
    >
      {children}
    </div>
  );
};

export const UserFullname = ({ children, color }) => {
  return (
    <div
      className="text-center font-bold"
      style={{ fontSize: "0.8vw", marginBottom: "12%", color }}
    >
      {children}
    </div>
  );
};
