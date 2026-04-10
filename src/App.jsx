import { useState } from "react";
import Barang from "./pages/Barang";
import Transaksi from "./pages/Transaksi";
import Pengaturan from "./pages/Pengaturan";

function App() {
  const [page, setPage] = useState("barang");
  const [cart, setCart] = useState([]);
  const [mode, setMode] = useState("jual");

  return (
    <div className="min-h-screen bg-gray-100">

      {page === "barang" && (
        <Barang
          cart={cart}
          setCart={setCart}
          mode={mode}
          setMode={setMode}
          setPage={setPage}
        />
      )}

      {page === "transaksi" && (
        <Transaksi
          cart={cart}
          setCart={setCart}
          mode={mode}
          onBack={() => setPage("barang")}
          onSelesai={() => setCart([])}
          setMode={setMode}
          setPage={setPage}
        />
      )}

      {page === "pengaturan" && (
        <Pengaturan setPage={setPage} />
      )}

    </div>
  );
}

export default App;