import * as XLSX from "xlsx";

export const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  // 1. Buat worksheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Atur Lebar Kolom Otomatis (Auto-fit width) biar teks gak ketimpa
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  const colWidths: { wch: number }[] = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // Lebar minimal
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = { c: C, r: R };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];
      if (cell && cell.v !== undefined) {
        const valueLength = String(cell.v).length;
        if (valueLength > maxWidth) {
          maxWidth = valueLength;
        }
      }
    }
    colWidths.push({ wch: maxWidth + 4 }); // Tambah padding dikit biar longgar
  }
  worksheet["!cols"] = colWidths;

  // 3. Styling Border, Alignment Center, dan Bold untuk Header
  for (let cellKey in worksheet) {
    if (cellKey.startsWith("!")) continue;

    const cell = worksheet[cellKey];
    const isHeader = cellKey.match(/[0-9]+/)?.[0] === "1"; // Baris pertama (Header horizontal)
    const isRowHeader = cellKey.startsWith("A") || cellKey.startsWith("B"); // Kolom No & Nama (Vertikal utama)

    cell.s = {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      font: {
        name: "Arial",
        sz: 10,
        bold: isHeader || (isRowHeader && !cellKey.startsWith("A1")), // Bold header & kolom nama/no
      },
      border: {
        top: { style: "thin", color: { rgb: "D3D3D3" } },
        bottom: { style: "thin", color: { rgb: "D3D3D3" } },
        left: { style: "thin", color: { rgb: "D3D3D3" } },
        right: { style: "thin", color: { rgb: "D3D3D3" } },
      },
    };
  }

  // 4. Buat Workbook dan Export File
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
      
