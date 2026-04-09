export default function Sidebar({ setPage, page }) {
  const menuClass = (name) =>
    `w-full text-left px-4 py-3 rounded-lg transition ${
      page === name
        ? "bg-gray-700 font-semibold"
        : "hover:bg-gray-700"
    }`;

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Sakinah POS
      </div>

      <nav className="flex-1 p-3 space-y-2">
        <button
          onClick={() => setPage("dashboard")}
          className={menuClass("dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          onClick={() => setPage("barang")}
          className={menuClass("barang")}
        >
          📦 Barang
        </button>

        <button
          onClick={() => setPage("transaksi")}
          className={menuClass("transaksi")}
        >
          💰 Transaksi
        </button>
      </nav>
    </div>
  );
}