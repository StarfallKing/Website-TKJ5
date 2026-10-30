import ExcelJS from "exceljs";

export const exportToExcel = async (data: any[], fileName: string, sheetName: string = "Data") => {
  if (!data.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Ambil keys dari data sebagai Header Kolom
  const keys = Object.keys(data[0]);
  worksheet.addRow(keys);

  // Masukkan Baris Data
  data.forEach((item) => {
    const rowData = keys.map((key) => item[key]);
    worksheet.addRow(rowData);
  });

  // Atur Tinggi Baris Header & Baris Data biar tidak sesak ke bawah
  worksheet.getRow(1).height = 24; // Header sedikit lebih tinggi
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 20; // Baris isi dibuat lebih lega ke bawah
    }
  });

  // Styling Header (Baris 1) -> Bold, Background Abu-abu, Center, Ada Border
  const headerRow = worksheet.getRow(1);
  headerRow.font = { name: "Arial", size: 10, bold: true };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E0E0E0" },
    };
  });

  // Styling Isi Tabel (Baris 2 ke bawah) -> Border & Alignment (Nama/NISN rata kiri, sisanya rata tengah)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.font = { name: "Arial", size: 10 };
    row.eachCell((cell, colNumber) => {
      const headerName = keys[colNumber - 1]?.toLowerCase() || "";
      const isTextColumn = headerName.includes("nama") || headerName.includes("nisn");

      cell.alignment = {
        horizontal: isTextColumn ? "left" : "center",
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

  // Atur Lebar Kolom Otomatis (Auto-fit) dengan pengecualian kolom "No"
  worksheet.columns.forEach((column, index) => {
    const headerName = keys[index]?.toLowerCase() || "";
    
    // Jika kolom pertama atau judulnya mengandung "no", buat ukurannya pas/kecil saja
    if (index === 0 || headerName === "no") {
      column.width = 8;
      return;
    }

    let maxLength = 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? String(cell.value).length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength + 5;
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
