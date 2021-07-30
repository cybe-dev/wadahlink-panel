export default function Loader({ className }) {
  return (
    <div className="loader">
      <div className={className}></div>
      <div className={className}></div>
      <div className={className}></div>
    </div>
  );
}
