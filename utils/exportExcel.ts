export const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  if (!data.length) return;

  // 1. Ambil semua kunci/kolom dari objek data pertama sebagai Header
  const keys = Object.keys(data[0]);

  // 2. Buat tabel HTML lengkap dengan styling CSS inline (Border, Bold, Alignment)
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 10pt; }
        th {
          background-color: #f2f2f2;
          border: 1px solid #000000;
          font-weight: bold;
          text-align: center;
          padding: 8px;
        }
        td {
          border: 1px solid #000000;
          padding: 6px;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
  `;

  // Masukkan Header Horizontal
  keys.forEach((key) => {
    html += `<th>${key}</th>`;
  });
  html += `</tr></thead><tbody>`;

  // Masukkan Baris Data Isi
  data.forEach((row, rowIndex) => {
    html += `<tr>`;
    keys.forEach((key, colIndex) => {
      const val = row[key] !== undefined && row[key] !== null ? row[key] : "";
      
      // Atur Alignment: Kolom 0 (No) & Kolom 1 (Nama/NISN) atau angka diatur center/left
      // Kolom Nama (biasanya index 1 atau key 'Nama') rata kiri, sisanya rata tengah
      let align = "center";
      if (key.toLowerCase().includes("nama") || key.toLowerCase().includes("nisn")) {
        align = "left";
      }

      html += `<td style="text-align: ${align};">${val}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table></body></html>`;

  // 3. Ubah string HTML menjadi Blob file Excel (.xls) dan trigger download
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
