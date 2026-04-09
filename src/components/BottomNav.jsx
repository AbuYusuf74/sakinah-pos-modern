import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const menus = [
    { name: "Home", path: "/" },
    { name: "Barang", path: "/barang" },
    { name: "Transaksi", path: "/transaksi" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white flex justify-around py-2 shadow-lg">
      {menus.map((menu) => (
        <Link
          key={menu.path}
          to={menu.path}
          className={`flex flex-col items-center text-xs ${
            location.pathname === menu.path
              ? "text-blue-400"
              : "text-gray-300"
          }`}
        >
          <span>{menu.name}</span>
        </Link>
      ))}
    </div>
  );
}