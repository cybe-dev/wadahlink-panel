import { forwardRef } from "react";
import { ReactComponent as Pencil } from "../svg/pencil.svg";
import { ReactComponent as Trash } from "../svg/trash.svg";

const LinkList = forwardRef(
  ({ name, url, onEdit, onDelete, ...props }, ref) => {
    return (
      <div
        className="mt-3 shadow-sm rounded-sm bg-white-100 flex justify-center items-center"
        ref={ref}
        {...props}
      >
        <div className="flex-1 px-5">
          <div className="font-bold">{name}</div>
          <div className="text-sm text-black-200">{url}</div>
        </div>
        <div className="flex flex-col items-center justify-center ml-3 border-l border-white-300 rounded-tr-sm rounded-br-sm">
          <button
            className="bg-white-100 hover:shadow-lg transition-all duration-200 w-12 h-12 border-b border-white-300 flex justify-center items-center"
            type="button"
            onClick={onEdit}
          >
            <Pencil width={16} height={16} />
          </button>
          <button
            className="bg-white-100 hover:shadow-lg transition-all duration-200 w-12 h-12 flex justify-center items-center"
            onClick={onDelete}
          >
            <Trash width={18} height={18} />
          </button>
        </div>
      </div>
    );
  }
);

export default LinkList;
