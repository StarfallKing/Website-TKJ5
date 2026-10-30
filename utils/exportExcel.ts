import ExcelJS from "exceljs";

export const exportToExcel = async (data: any[], fileName: string, sheetName: string = "Data") => {
  if (!data.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 1. Transformasi Data: Gabungkan 4 kolom persentase menjadi 1 kolom ringkasan jika datanya ada
  const processedData = data.map((item) => {
    const newItem = { ...item };
    
    // Jika data memiliki atribut persentase terpisah, kita gabung jadi satu string rapi
    if ("Persentase Hadir" in newItem || "Persentase Izin" in newItem) {
      const h = newItem["Persentase Hadir"] ?? "0%";
      const i = newItem["Persentase Izin"] ?? "0%";
      const s = newItem["Persentase Sakit"] ?? "0%";
      const a = newItem["Persentase Alpa"] ?? "0%";

      // Hapus kolom terpisahnya agar tidak menumpuk
      delete newItem["Persentase Hadir"];
      delete newItem["Persentase Izin"];
      delete newItem["Persentase Sakit"];
      delete newItem["Persentase Alpa"];

      // Buat kolom gabungan baru
      newItem["Ringkasan Persentase"] = `H: ${h} | I: ${i} | S: ${s} | A: ${a}`;
    }
    return newItem;
  });

  // Ambil keys dari data yang sudah diproses sebagai Header Kolom
  const keys = Object.keys(processedData[0]);
  worksheet.addRow(keys);

  // Masukkan Baris Data
  processedData.forEach((item) => {
    const rowData = keys.map((key) => item[key]);
    worksheet.addRow(rowData);
  });

  // Atur Tinggi Baris Header & Baris Data
  worksheet.getRow(1).height = 24;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 20;
    }
  });

  // 2. STYLING HEADER (BARIS 1) - PASTIKAN SEMUA KOLOM TERKENA BACKGROUND ABU-ABU & BOLD
  const headerRow = worksheet.getRow(1);
  headerRow.font = { name: "Arial", size: 10, bold: true };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  
  // Gunakan perulangan cell manual berdasarkan jumlah kolom agar kolom pertama (No) pasti kena
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: "Arial", size: 10, bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E0E0E0" }, // Abu-abu terang seragam untuk semua header termasuk kolom No
    };
  });

  // 3. STYLING ISI TABEL (BARIS 2 KE BAWAH)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.font = { name: "Arial", size: 10 };
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const headerName = keys[colNumber - 1]?.toLowerCase() || "";
      const isTextColumn = headerName.includes("nama") || headerName.includes("nisn") || headerName.includes("ringkasan");

      cell.alignment = {
        horizontal: isTextColumn && !headerName.includes("no") ? "left" : "center",
        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });
  });

  // 4. ATUR LEBAR KOLOM OTOMATIS (AUTO-FIT)
  worksheet.columns.forEach((column, index) => {
    const headerName = keys[index]?.toLowerCase() || "";
    
    if (index === 0 || headerName.includes("no")) {
      column.width = 6; // Kolom No dibuat pas
      return;
    }

    let maxLength = 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? String(cell.value).length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength + 4;
  });

  // Generate file dan download di browser
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
  
