import * as XLSX from "xlsx";

export const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  // 1. Buat worksheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Atur Lebar Kolom Otomatis (Auto-fit width) biar gak ketimpa
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  const colWidths: { wch: number }[] = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10;
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
    colWidths.push({ wch: maxWidth + 5 });
  }
  worksheet["!cols"] = colWidths;

  // 3. Iterasi tiap sel untuk menyusun Alignment, Bold Header, dan Border
  for (let cellKey in worksheet) {
    if (cellKey.startsWith("!")) continue;

    const cell = worksheet[cellKey];
    const colLetter = cellKey.replace(/[0-9]/g, ""); // Ambil huruf kolom (A, B, C, dst)
    const rowNumber = parseInt(cellKey.replace(/[^0-9]/g, ""), 10); // Ambil nomor baris

    const isHeader = rowNumber === 1; // Baris 1 (Judul Horizontal)
    const isRowHeader = colLetter === "A" || colLetter === "B"; // Kolom No & Nama (Judul Vertikal)
    const isTextColumn = colLetter === "B" || colLetter === "C"; // Kolom Nama & NISN rata kiri

    // Format styling cell SheetJS
    cell.s = {
      alignment: {
        horizontal: isTextColumn && !isHeader ? "left" : "center",
        vertical: "center",
      },
      font: {
        name: "Arial",
        sz: 10,
        bold: isHeader || (isRowHeader && !isHeader), // Bold untuk header & kolom utama
      },
      border: {
        top: { style: "thin", color: { rgb: "A0A0A0" } },
        bottom: { style: "thin", color: { rgb: "A0A0A0" } },
        left: { style: "thin", color: { rgb: "A0A0A0" } },
        right: { style: "thin", color: { rgb: "A0A0A0" } },
      },
    };
  }

  // 4. Buat Workbook dan Unduh File
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
