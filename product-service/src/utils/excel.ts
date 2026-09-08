import ExcelJS from 'exceljs';

export async function readWorkbookRows(buffer: Buffer): Promise<Record<string, string>[]> {
  const workbook = new ExcelJS.Workbook();
  // exceljs/index.d.ts có `export` ở top-level nên là 1 module — `declare interface Buffer
  // extends ArrayBuffer {}` trong đó chỉ cục bộ trong module này, KHÔNG phải Buffer global của
  // @types/node. load() đòi kiểu Buffer riêng đó nên phải ép qua `any` mới bỏ qua được check
  // (runtime vẫn nhận đúng Buffer thật — chỉ là lỗi type declaration của thư viện).
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    return [];
  }

  const headers: string[] = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value ?? '').trim();
  });

  const rows: Record<string, string>[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const record: Record<string, string> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        record[header] = cell.value !== null && cell.value !== undefined ? String(cell.value).trim() : '';
      }
    });
    if (Object.values(record).some((v) => v !== '')) {
      rows.push(record);
    }
  });

  return rows;
}

export async function buildWorkbookBuffer(
  columns: string[],
  rows: Array<Record<string, string | number>>,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.addRow(columns);
  for (const row of rows) {
    worksheet.addRow(columns.map((col) => row[col] ?? ''));
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
