import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Pengaturan({ onClose }) {
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
  const [uploading, setUploading] = useState(false);

  // =========================
  // LOAD DATA
  // =========================
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

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPLOAD LOGO
  // =========================
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `logo-${Date.now()}`;

    const { error } = await supabase.storage
      .from("logo")
      .upload(fileName, file);

    if (error) {
      alert("❌ Upload gagal");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("logo")
      .getPublicUrl(fileName);

    setForm({
      ...form,
      logo_url: data.publicUrl,
    });

    setUploading(false);
  };

  // =========================
  // SAVE
  // =========================
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
      onClose();
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-white rounded-t-2xl p-4 space-y-3 max-h-[90vh] overflow-y-auto shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">
          ⚙️ Pengaturan Toko
        </h2>

        <button
          onClick={onClose}
          className="text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>

      {/* INPUT */}
      <input
        name="nama_toko"
        value={form.nama_toko}
        onChange={handleChange}
        placeholder="Nama Toko"
        className="w-full border p-3 rounded-lg"
      />

      <textarea
        name="alamat"
        value={form.alamat}
        onChange={handleChange}
        placeholder="Alamat"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="no_hp"
        value={form.no_hp}
        onChange={handleChange}
        placeholder="Nomor HP"
        className="w-full border p-3 rounded-lg"
      />

      {/* LOGO */}
      <div>
        <label className="text-sm text-gray-600">
          Logo Toko
        </label>

        <input
          type="file"
          onChange={handleUpload}
          className="mt-1"
        />

        {uploading && (
          <div className="text-sm text-blue-500">
            Uploading...
          </div>
        )}

        {form.logo_url && (
          <img
            src={form.logo_url}
            className="h-16 mt-2 rounded"
          />
        )}
      </div>

      <hr />

      {/* FOOTER */}
      <input
        name="footer1"
        value={form.footer1}
        onChange={handleChange}
        placeholder="Footer 1"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="footer2"
        value={form.footer2}
        onChange={handleChange}
        placeholder="Footer 2"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="footer3"
        value={form.footer3}
        onChange={handleChange}
        placeholder="Footer 3"
        className="w-full border p-3 rounded-lg"
      />

      {/* ACTION */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-3"
      >
        {loading ? "Menyimpan..." : "💾 Simpan"}
      </button>

    </div>
  );
}

export default Pengaturan;