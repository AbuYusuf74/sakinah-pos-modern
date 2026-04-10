import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Barang({ cart, setCart, mode, setMode, setPage }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    id: null,
    barcode: "",
    nama: "",
    satuan: "",
    hargabeli: 0,
    hargajual: 0,
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
  };

  const loadData = async () => {
    const { data, error } = await supabase
      .from("Barang")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // CART
  // =========================
  const handleAddToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id
            ? { ...i, qty: (i.qty || 1) + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const totalQty = cart.reduce(
    (sum, item) => sum + (item.qty || 1),
    0
  );

  const totalHarga = cart.reduce(
    (sum, item) =>
      sum +
      (item.qty || 1) *
        (mode === "jual" ? item.hargajual : item.hargabeli),
    0
  );

  // =========================
  // FORM
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name.includes("harga") ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama) {
      alert("Nama barang wajib diisi");
      return;
    }

    const payload = { ...form };

    let error;

    if (form.id) {
      const res = await supabase
        .from("Barang")
        .update(payload)
        .eq("id", form.id);

      error = res.error;
    } else {
      const res = await supabase.from("Barang").insert([payload]);
      error = res.error;
    }

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    resetForm();
    setShowForm(false);
    loadData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    const konfirmasi = confirm(
      `Yakin ingin menghapus:\n\n${item.nama} ?`
    );

    if (!konfirmasi) return;

    const { error } = await supabase
      .from("Barang")
      .delete()
      .eq("id", item.id);

    if (!error) loadData();
  };

  const resetForm = () => {
    setForm({
      id: null,
      barcode: "",
      nama: "",
      satuan: "",
      hargabeli: 0,
      hargajual: 0,
    });
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-4 max-w-xl mx-auto pb-32">

      <h2 className="text-xl font-bold">📦 Data Barang</h2>

      {/* SEARCH */}
      <input
        placeholder="Cari barang..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowForm(false);
        }}
        className="w-full border p-3 rounded-xl text-lg shadow-sm"
      />

      {/* TAMBAH */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="w-full bg-green-600 text-white py-3 rounded-xl text-lg"
      >
        ➕ Tambah Barang
      </button>

      {/* MODE */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("jual")}
          className={`flex-1 py-2 rounded ${
            mode === "jual"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          JUAL
        </button>

        <button
          onClick={() => setMode("beli")}
          className={`flex-1 py-2 rounded ${
            mode === "beli"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          BELI
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAddToCart(item)}
            className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 cursor-pointer active:scale-95"
          >
            <div className="font-semibold">{item.nama}</div>

            <div className="text-sm text-gray-500">
              {item.satuan} • {item.barcode}
            </div>

            <div className="flex justify-between text-sm">
              <div>Rp {formatRupiah(item.hargabeli)}</div>
              <div className="text-green-600 font-bold">
                Rp {formatRupiah(item.hargajual)}
              </div>
            </div>

            {/* AKSI */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
              >
                ✏️ Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                🗑️ Hapus
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode" className="w-full border p-3 rounded-lg" />
            <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Barang" className="w-full border p-3 rounded-lg" />
            <input name="satuan" value={form.satuan} onChange={handleChange} placeholder="Satuan" className="w-full border p-3 rounded-lg" />
            <input name="hargabeli" type="number" value={form.hargabeli} onChange={handleChange} placeholder="Harga Beli" className="w-full border p-3 rounded-lg" />
            <input name="hargajual" type="number" value={form.hargajual} onChange={handleChange} placeholder="Harga Jual" className="w-full border p-3 rounded-lg" />

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
                💾 Simpan
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 text-white py-3 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOTTOM CART */}
      {totalQty > 0 && (
        <div
          onClick={() => setPage("transaksi")}
          className={`fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center shadow-xl cursor-pointer
            ${mode === "jual" ? "bg-green-600" : "bg-blue-600"} text-white`}
        >
          <div>
            🛒 {totalQty} item
            <div className="text-xs">Mode: {mode.toUpperCase()}</div>
          </div>

          <div className="font-bold">
            Rp {formatRupiah(totalHarga)}
          </div>
        </div>
      )}

    </div>
  );
}

export default Barang;