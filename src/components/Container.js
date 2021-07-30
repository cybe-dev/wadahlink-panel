export default function Container({ className, children }) {
  return (
    <div
      className={"w-full mx-5 md:mx-0 md:w-640 lg:w-768 xl:w-1024 " + className}
    >
      {children}
    </div>
  );
}
