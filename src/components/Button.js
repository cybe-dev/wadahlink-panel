export default function Button({
  children,
  className,
  classBackground = "bg-primary-100 hover:bg-primary-200",
  ...props
}) {
  return (
    <button
      className={
        classBackground +
        " h-10 text-white-100 rounded-sm flex justify-center items-center " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
