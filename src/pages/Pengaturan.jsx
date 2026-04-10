import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Pengaturan() {
  const [form, setForm] = useState({
    nama_toko: "",
    alamat: "",
    no_hp: "",
    logo_url: "",
    footer1: "",
    footer2: "",
    footer3: "",
  });

  const [loading, setLoading] = useState(false);

  // ambil data awal
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("toko_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setForm(data);
      }
    };

    fetchData();
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // upload logo
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const fileName = `logo-${Date.now()}`;

    const { error } = await supabase.storage
      .from("logo")
      .upload(fileName, file);

    if (error) {
      alert("Upload gagal");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("logo")
      .getPublicUrl(fileName);

    setForm({
      ...form,
      logo_url: data.publicUrl,
    });

    setLoading(false);
  };

  // simpan
  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("toko_settings")
      .update(form)
      .eq("id", 1);

    setLoading(false);

    if (error) {
      alert("❌ Gagal simpan");
    } else {
      alert("✅ Berhasil disimpan");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3 pb-32">

      <h2 className="text-xl font-bold">⚙️ Pengaturan Toko</h2>

      <input
        name="nama_toko"
        value={form.nama_toko}
        onChange={handleChange}
        placeholder="Nama Toko"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="alamat"
        value={form.alamat}
        onChange={handleChange}
        placeholder="Alamat"
        className="w-full border p-2 rounded"
      />

      <input
        name="no_hp"
        value={form.no_hp}
        onChange={handleChange}
        placeholder="Nomor HP"
        className="w-full border p-2 rounded"
      />

      <div>
        <label className="text-sm">Upload Logo</label>
        <input type="file" onChange={handleUpload} />
        {form.logo_url && (
          <img src={form.logo_url} className="h-16 mt-2" />
        )}
      </div>

      <hr />

      <input
        name="footer1"
        value={form.footer1}
        onChange={handleChange}
        placeholder="Footer 1"
        className="w-full border p-2 rounded"
      />

      <input
        name="footer2"
        value={form.footer2}
        onChange={handleChange}
        placeholder="Footer 2"
        className="w-full border p-2 rounded"
      />

      <input
        name="footer3"
        value={form.footer3}
        onChange={handleChange}
        placeholder="Footer 3"
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>

      <button
        onClick={() => setPage("barang")}
        className="mb-3 bg-gray-300 px-3 py-2 rounded"
      >
        ← Kembali
      </button>      

    </div>
  );
}

export default Pengaturan;