import * as XLSX from "xlsx";

/**
 * Exports an array of objects to an authentic Microsoft Excel (.xlsx) file.
 * @param data Array of records to export
 * @param filename File name without or with .xlsx extension
 * @param sheetName Sheet tab name inside the workbook
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = "Report"
) {
  if (!data || data.length === 0) {
    const emptyWb = XLSX.utils.book_new();
    const emptyWs = XLSX.utils.json_to_sheet([{ Message: "No data available" }]);
    XLSX.utils.book_append_sheet(emptyWb, emptyWs, sheetName);
    XLSX.writeFile(
      emptyWb,
      filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`
    );
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Calculate dynamic column widths based on maximum cell content length
  const keys = Object.keys(data[0]);
  const colWidths = keys.map((key) => {
    const maxContentLength = Math.max(
      key.length,
      ...data.map((row) => {
        const val = row[key];
        if (val === null || val === undefined) return 0;
        if (typeof val === "object") return JSON.stringify(val).length;
        return String(val).length;
      })
    );
    return {
      wch: Math.min(Math.max(maxContentLength + 4, 12), 60),
    };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const cleanFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanFilename);
}
