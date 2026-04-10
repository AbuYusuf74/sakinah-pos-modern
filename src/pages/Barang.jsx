import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Barang() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
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

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-40">

      <h2 className="text-xl font-bold">📦 Data Barang</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Cari barang..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowForm(false); // auto hide form
        }}
        className="w-full border p-3 rounded-xl text-lg shadow-sm"
      />

      {/* ➕ TOMBOL TAMBAH */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="w-full bg-green-600 text-white py-3 rounded-xl text-lg"
      >
        ➕ Tambah Barang
      </button>

      {/* 📱 LIST */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="text-lg font-semibold">{item.nama}</div>

            <div className="text-sm text-gray-500">
              {item.satuan} • {item.barcode}
            </div>

            <div className="flex justify-between text-sm">
              <div>
                Rp {formatRupiah(item.hargabeli)}
              </div>
              <div className="text-green-600 font-bold">
                Rp {formatRupiah(item.hargajual)}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(item)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 FORM (FOOTER) */}
      {showForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t">
          <form onSubmit={handleSubmit} className="space-y-2">

            <input
              name="barcode"
              placeholder="Barcode"
              value={form.barcode}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              autoFocus
            />

            <input
              name="nama"
              placeholder="Nama Barang"
              value={form.nama}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="satuan"
              placeholder="Satuan"
              value={form.satuan}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="hargabeli"
              type="number"
              placeholder="Harga Beli"
              value={form.hargabeli}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="hargajual"
              type="number"
              placeholder="Harga Jual"
              value={form.hargajual}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

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
    </div>
  );
}

export default Barang;