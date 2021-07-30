import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center font-xl text-center">
      Halaman Tidak Ditemukan
      <Helmet>
        <title>Halaman Tidak Ditemukan</title>
      </Helmet>
    </div>
  );
}
