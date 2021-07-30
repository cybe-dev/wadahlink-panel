export default function Alert({ className, children }) {
  return (
    <div
      className={"bg-red-100 text-white-100 p-3 px-1 rounded-sm " + className}
    >
      {children}
    </div>
  );
}
