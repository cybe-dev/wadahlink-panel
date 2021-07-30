export default function Card({ children, className }) {
  return (
    <div className={"bg-white-100 rounded-sm p-5 lg:p-8 " + className}>
      {children}
    </div>
  );
}
