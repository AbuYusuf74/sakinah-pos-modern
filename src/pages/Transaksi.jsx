import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Struk from "../components/Struk";
import Pengaturan from "./Pengaturan";

function Transaksi({ cart, setCart, mode, onBack, onSelesai, setPage }) {
  const [bayar, setBayar] = useState(0);
  const [showStruk, setShowStruk] = useState(false);
  const [showPengaturan, setShowPengaturan] = useState(false);
  const [lastTrx, setLastTrx] = useState(null);
  const [lastItems, setLastItems] = useState([]);
  const [toko, setToko] = useState(null);

  useEffect(() => {
    const fetchToko = async () => {
      const { data, error } = await supabase
        .from("toko_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error) {
        setToko(data);
      }
    };

    fetchToko();
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.qty || 1) * (mode === "jual" ? item.hargajual : item.hargabeli),
    0
  );

  const kembalian = bayar - total;

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const hapusItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto">

      {/* 🔥 TOP BAR STICKY */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">
          🧾 Transaksi {mode.toUpperCase()}
        </h2>

        <button
          onClick={() => setShowPengaturan(true)}
          className="text-sm bg-gray-200 px-3 py-1 rounded"
        >
          ⚙️
        </button>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-4 space-y-4 pb-40">

        {/* LIST ITEM */}
        {cart.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-xl shadow flex justify-between items-center">

            <div>
              <div className="font-semibold">{item.nama}</div>
              <div className="text-sm text-gray-500">
                Rp {(mode === "jual" ? item.hargajual : item.hargabeli)}
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                className="px-2 bg-gray-300 rounded"
              >-</button>

              <input
                type="number"
                value={item.qty || 1}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  updateQty(item.id, val);
                }}
                className="w-14 text-center border rounded"
              />

              <button
                onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                className="px-2 bg-gray-300 rounded"
              >+</button>

              <button
                onClick={() => hapusItem(item.id)}
                className="ml-2 text-red-600"
              >
                ✕
              </button>

            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div className="text-lg font-bold">
          Total: Rp {new Intl.NumberFormat("id-ID").format(total)}
        </div>

        {/* INPUT BAYAR */}
        <input
          type="number"
          placeholder="Jumlah Bayar"
          value={bayar}
          onChange={(e) => setBayar(Number(e.target.value))}
          className="w-full border p-3 rounded-lg"
        />

        {/* KEMBALIAN */}
        <div className="text-lg">
          Kembalian: Rp {new Intl.NumberFormat("id-ID").format(kembalian > 0 ? kembalian : 0)}
        </div>

        {/* AKSI */}
        <div className="flex gap-2">

          <button
            onClick={onBack}
            className="flex-1 bg-gray-400 text-white py-3 rounded-xl"
          >
            Kembali
          </button>

          <button
            onClick={async () => {
              try {
                if (bayar < total) {
                  alert("❌ Uang kurang!");
                  return;
                }

                const { data: trx, error: trxError } = await supabase
                  .from("transaksi")
                  .insert([
                    {
                      total: total,
                      bayar: bayar,
                      kembalian: kembalian > 0 ? kembalian : 0,
                      mode: mode,
                    },
                  ])
                  .select()
                  .single();

                if (trxError) throw trxError;

                const details = cart.map((item) => ({
                  transaksi_id: trx.id,
                  barang_id: item.id,
                  nama_barang: item.nama,
                  harga: mode === "jual" ? item.hargajual : item.hargabeli,
                  qty: item.qty || 1,
                  subtotal:
                    (item.qty || 1) *
                    (mode === "jual" ? item.hargajual : item.hargabeli),
                }));

                const { error: detailError } = await supabase
                  .from("transaksi_detail")
                  .insert(details);

                if (detailError) throw detailError;

                setLastTrx({
                  ...trx,
                  tanggal: new Date(),
                });

                setLastItems(details);

                setShowStruk(true);

              } catch (err) {
                console.error(err);
                alert("❌ Gagal simpan transaksi");
              }
            }}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl"
          >
            Simpan
          </button>

        </div>

      </div>

      {/* STRUK */}
      {showStruk && (
        <Struk
          data={lastTrx}
          items={lastItems}
          toko={toko}
          onTutup={() => {
            setShowStruk(false);
            onSelesai([]);
            onBack();
          }}
        />
      )}

    </div>
  );
}

export default Transaksi;