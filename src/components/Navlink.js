import { Link } from "react-router-dom";

export default function Navlink({ link = [] }) {
  return (
    <div className="flex relative mb-8">
      <div className="h-1 bg-white-400 w-full absolute bottom-0 left-0" />
      {link.map((item, index) => {
        let active = window.location.href.indexOf("/panel" + item.to) !== -1;
        return (
          <Link
            to={item.to}
            key={`${index}`}
            className={
              "pb-3 mr-5 cabin text-lg border-b-4 z-10 " +
              (active
                ? "text-black-100 border-primary-100"
                : "text-black-200 border-transparent hover:text-black-100")
            }
          >
            {item.value}
          </Link>
        );
      })}
    </div>
  );
}
