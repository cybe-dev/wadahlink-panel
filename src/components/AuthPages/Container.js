export default function Container({ children, className }) {
  return (
    <div className={"w-full h-screen bg-white-200 overflow-auto " + className}>
      {children}
    </div>
  );
}
