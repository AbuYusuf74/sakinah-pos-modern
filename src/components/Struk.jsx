function Struk({ data, items, toko, onTutup }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-sm rounded-xl p-4 space-y-2">

        {toko?.logo_url && (
        <img
            src={toko.logo_url}
            alt="logo"
            className="mx-auto h-12 mb-2"
        />
        )}

        <div className="text-center font-bold text-lg">
        {toko?.nama_toko || "TOKO"}
        </div>

        <div className="text-center text-xs">
        {toko?.alamat}
        </div>

        <div className="text-center text-xs">
        HP: {toko?.no_hp}
        </div>

        <div className="text-center text-sm">
          Tanggal: {new Date(data.tanggal).toLocaleString("id-ID")}
        </div>

        <hr />

        {/* LIST ITEM */}
        {items.map((item, i) => (
          <div key={i} className="text-sm">

            <div className="flex justify-between">
              <span>{item.nama_barang}</span>
              <span>{item.qty} x {item.harga}</span>
            </div>

            <div className="flex justify-between">
              <span></span>
              <span>
                Rp {new Intl.NumberFormat("id-ID").format(item.subtotal)}
              </span>
            </div>

          </div>
        ))}

        <hr />

        {/* TOTAL */}
        <div className="text-sm space-y-1">

          <div className="flex justify-between">
            <span>Total</span>
            <span>Rp {new Intl.NumberFormat("id-ID").format(data.total)}</span>
          </div>

          <div className="flex justify-between">
            <span>Bayar</span>
            <span>Rp {new Intl.NumberFormat("id-ID").format(data.bayar)}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Kembali</span>
            <span>Rp {new Intl.NumberFormat("id-ID").format(data.kembalian)}</span>
          </div>

        </div>

        <hr />

        <div className="text-center text-xs mt-2">
            <div>{toko?.footer1}</div>
            <div>{toko?.footer2}</div>
            <div>{toko?.footer3}</div>
        </div>

        <button
          onClick={onTutup}
          className="w-full bg-gray-800 text-white py-2 rounded-lg mt-2"
        >
          Tutup
        </button>

      </div>
    </div>
  );
}

export default Struk;