import { forwardRef } from "react";

const TextInput = forwardRef(
  ({ label, containerClassName, error, left, ...props }, ref) => {
    const Left = left;
    return (
      <div className={"w-full box-border " + containerClassName}>
        {label && <label>{label}</label>}
        <div className="bg-white-100 border border-white-400 rounded-sm flex items-center">
          <input
            ref={ref}
            className="h-10 px-2 flex-1 bg-transparent box-border"
            {...props}
          />
          {left && <Left />}
        </div>
        {error && <div className="text-red-100 text-sm">{error}</div>}
      </div>
    );
  }
);

export default TextInput;
