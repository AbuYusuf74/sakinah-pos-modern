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

      if (!error) setToko(data);
    };

    fetchToko();
  }, []);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka || 0);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.qty *
        (mode === "jual" ? item.hargajual : item.hargabeli),
    0
  );

  const kembalian = bayar - total;

  // =========================
  // QTY CONTROL (SAFE)
  // =========================
  const updateQty = (id, qty) => {
    if (qty < 1) return;

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const tambahQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const kurangQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const hapusItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto">

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          🧾 Transaksi {mode.toUpperCase()}
        </h2>

        <button
          onClick={() => setShowPengaturan(true)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition"
        >
          ⚙️
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4 pb-44">

        {/* LIST ITEM */}
        {cart.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Keranjang kosong
          </div>
        )}

        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-gray-800">
                {item.nama}
              </div>

              <div className="text-sm text-gray-500">
                Rp{" "}
                {formatRupiah(
                  mode === "jual"
                    ? item.hargajual
                    : item.hargabeli
                )}
              </div>

              <div className="text-xs text-gray-400">
                Subtotal: Rp{" "}
                {formatRupiah(
                  item.qty *
                    (mode === "jual"
                      ? item.hargajual
                      : item.hargabeli)
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => kurangQty(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg text-lg"
              >
                -
              </button>

              <input
                type="number"
                value={item.qty}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  updateQty(item.id, val);
                }}
                className="w-14 text-center border rounded-lg"
              />

              <button
                onClick={() => tambahQty(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg text-lg"
              >
                +
              </button>

              <button
                onClick={() => hapusItem(item.id)}
                className="ml-2 text-red-600 text-lg"
              >
                ✕
              </button>

            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div className="bg-white p-4 rounded-xl shadow text-lg font-bold flex justify-between">
          <span>Total</span>
          <span>Rp {formatRupiah(total)}</span>
        </div>

        {/* BAYAR */}
        <input
          type="number"
          placeholder="Jumlah Bayar"
          value={bayar}
          onChange={(e) => setBayar(Number(e.target.value))}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />

        {/* KEMBALIAN */}
        <div className="text-lg font-semibold text-green-600">
          Kembalian: Rp{" "}
          {formatRupiah(kembalian > 0 ? kembalian : 0)}
        </div>

        {/* AKSI */}
        <div className="flex gap-2">

          <button
            onClick={onBack}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl"
          >
            Kembali
          </button>

          <button
            onClick={async () => {
              try {
                if (cart.length === 0) {
                  alert("Keranjang kosong");
                  return;
                }

                if (bayar < total) {
                  alert("❌ Uang kurang!");
                  return;
                }

                const { data: trx, error: trxError } = await supabase
                  .from("transaksi")
                  .insert([
                    {
                      total,
                      bayar,
                      kembalian: kembalian > 0 ? kembalian : 0,
                      mode,
                    },
                  ])
                  .select()
                  .single();

                if (trxError) throw trxError;

                const details = cart.map((item) => ({
                  transaksi_id: trx.id,
                  barang_id: item.id,
                  nama_barang: item.nama,
                  harga:
                    mode === "jual"
                      ? item.hargajual
                      : item.hargabeli,
                  qty: item.qty,
                  subtotal:
                    item.qty *
                    (mode === "jual"
                      ? item.hargajual
                      : item.hargabeli),
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
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
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

      {/* 🔥 PENGATURAN (FIX) */}
      {showPengaturan && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowPengaturan(false)}
          ></div>

          <div className="fixed bottom-0 left-0 right-0 z-50">
            <Pengaturan onClose={() => setShowPengaturan(false)} />
          </div>
        </>
      )}

    </div>
  );
}

export default Transaksi;