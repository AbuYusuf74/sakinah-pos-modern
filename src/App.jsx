import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Barang from "./pages/barang";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar setPage={setPage} page={page} />
      </div>

      {/* SIDEBAR MOBILE (DRAWER) */}
      {openSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpenSidebar(false)}
          />

          {/* drawer */}
          <div className="w-64 bg-gray-800">
            <Sidebar
              setPage={(p) => {
                setPage(p);
                setOpenSidebar(false); // otomatis tutup setelah klik
              }}
              page={page}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-14 bg-white shadow flex items-center justify-between px-4">
          {/* tombol hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpenSidebar(true)}
          >
            ☰
          </button>

          <h1 className="font-semibold">
            Sakinah POS - {page.toUpperCase()}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-auto">
          {page === "dashboard" && <h2>Dashboard</h2>}
          {page === "barang" && <Barang />}
          {page === "transaksi" && <h2>Halaman Transaksi</h2>}
        </div>
      </div>
    </div>
  );
}