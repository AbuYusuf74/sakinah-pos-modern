import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Barang() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    barcode: "",
    nama: "",
    satuan: "",
    hargabeli: 0,
    hargajual: 0,
  });

  // 🔢 FORMAT RUPIAH (HANYA TAMPILAN)
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
  };

  // 🔄 LOAD DATA
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

  // 🔍 FILTER
  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  // ✍️ INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name.includes("harga") ? Number(value) : value,
    });
  };

  // 💾 SIMPAN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama) {
      alert("Nama barang wajib diisi");
      return;
    }

    const payload = {
      barcode: form.barcode,
      nama: form.nama,
      satuan: form.satuan,
      hargabeli: Number(form.hargabeli),
      hargajual: Number(form.hargajual),
    };

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
    loadData();
  };

  // ✏️ EDIT
  const handleEdit = (item) => {
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE
  const handleDelete = async (id) => {
    const konfirmasi = confirm("Hapus data ini?");
    if (!konfirmasi) return;

    const { error } = await supabase
      .from("Barang")
      .delete()
      .eq("id", id);

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
    <div className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">📦 Data Barang</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Cari barang..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-xl text-lg shadow-sm"
      />

      {/* 📦 FORM */}
      <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded-xl shadow">
        <input
          name="barcode"
          placeholder="Scan / input barcode"
          value={form.barcode}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-lg"
          autoFocus
        />

        <input
          name="nama"
          placeholder="Nama Barang"
          value={form.nama}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-lg"
        />

        <input
          name="satuan"
          placeholder="Satuan"
          value={form.satuan}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-lg"
        />

        <input
          name="hargabeli"
          type="number"
          placeholder="Harga Beli"
          value={form.hargabeli}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-lg"
        />

        <input
          name="hargajual"
          type="number"
          placeholder="Harga Jual"
          value={form.hargajual}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-lg"
        />

        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-lg shadow">
            💾 Simpan
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-400 text-white py-3 rounded-xl text-lg"
          >
            Reset
          </button>
        </div>
      </form>

      {/* 📱 LIST */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
          >
            {/* NAMA */}
            <div className="text-lg font-semibold">{item.nama}</div>

            {/* INFO */}
            <div className="text-sm text-gray-500">
              {item.satuan} • Barcode: {item.barcode}
            </div>

            {/* HARGA */}
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-500">Beli</span><br />
                <span className="font-medium">
                  Rp {formatRupiah(item.hargabeli)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-gray-500">Jual</span><br />
                <span className="font-bold text-green-600">
                  Rp {formatRupiah(item.hargajual)}
                </span>
              </div>
            </div>

            {/* AKSI */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Barang;