function Struk({ data, items, toko, onTutup }) {

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka || 0);

  // =========================
  // DETEKSI ANDROID
  // =========================
  const isAndroid = /Android/i.test(navigator.userAgent);

  // =========================
  // FORMAT STRUK TEXT (UNTUK WA / PRINT)
  // =========================
  const generateText = () => {
    let text = "";

    text += `${toko?.nama_toko || "TOKO"}\n`;
    text += `${toko?.alamat || ""}\n`;
    text += `HP: ${toko?.no_hp || ""}\n`;
    text += `--------------------------\n`;

    text += `Tanggal:\n${new Date(data.tanggal).toLocaleString("id-ID")}\n`;
    text += `--------------------------\n`;

    items.forEach((item) => {
      text += `${item.nama_barang}\n`;
      text += `${item.qty} x ${formatRupiah(item.harga)}\n`;
      text += `= ${formatRupiah(item.subtotal)}\n\n`;
    });

    text += `--------------------------\n`;
    text += `Total : ${formatRupiah(data.total)}\n`;
    text += `Bayar : ${formatRupiah(data.bayar)}\n`;
    text += `Kembali : ${formatRupiah(data.kembalian)}\n`;
    text += `--------------------------\n`;

    text += `${toko?.footer1 || ""}\n`;
    text += `${toko?.footer2 || ""}\n`;
    text += `${toko?.footer3 || ""}\n`;

    return text;
  };

  // =========================
  // KIRIM WA
  // =========================
  const kirimWA = () => {
    const text = generateText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // =========================
  // PRINT (BROWSER)
  // =========================
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-sm rounded-xl p-4 space-y-2 print:w-[58mm] print:max-w-none">

        {/* LOGO */}
        {toko?.logo_url && (
          <img
            src={toko.logo_url}
            alt="logo"
            className="mx-auto h-12 mb-2"
          />
        )}

        {/* HEADER */}
        <div className="text-center font-bold text-lg">
          {toko?.nama_toko || "TOKO"}
        </div>

        <div className="text-center text-xs">
          {toko?.alamat}
        </div>

        <div className="text-center text-xs">
          HP: {toko?.no_hp}
        </div>

        <div className="text-center text-xs">
          {new Date(data.tanggal).toLocaleString("id-ID")}
        </div>

        <hr />

        {/* LIST ITEM */}
        {items.map((item, i) => (
          <div key={i} className="text-sm">

            <div>{item.nama_barang}</div>

            <div className="flex justify-between">
              <span>{item.qty} x {formatRupiah(item.harga)}</span>
              <span>{formatRupiah(item.subtotal)}</span>
            </div>

          </div>
        ))}

        <hr />

        {/* TOTAL */}
        <div className="text-sm space-y-1">

          <div className="flex justify-between">
            <span>Total</span>
            <span>{formatRupiah(data.total)}</span>
          </div>

          <div className="flex justify-between">
            <span>Bayar</span>
            <span>{formatRupiah(data.bayar)}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Kembali</span>
            <span>{formatRupiah(data.kembalian)}</span>
          </div>

        </div>

        <hr />

        {/* FOOTER */}
        <div className="text-center text-xs">
          <div>{toko?.footer1}</div>
          <div>{toko?.footer2}</div>
          <div>{toko?.footer3}</div>
        </div>

        {/* ACTION */}
        <div className="space-y-2 mt-3 print:hidden">

          {isAndroid && (
            <button
              onClick={kirimWA}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              📲 Kirim ke WhatsApp
            </button>
          )}

          <button
            onClick={handlePrint}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            🖨️ Print
          </button>

          <button
            onClick={onTutup}
            className="w-full bg-gray-800 text-white py-2 rounded-lg"
          >
            Tutup
          </button>

        </div>

      </div>
    </div>
  );
}

export default Struk;