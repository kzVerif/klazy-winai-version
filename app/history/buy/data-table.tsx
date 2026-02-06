"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { format } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const filteredData = React.useMemo(() => {
    if (!filterValue) return data;

    const lower = filterValue.toLowerCase();
    return data.filter(
      (item: any) =>
        item.id.toLowerCase().includes(lower) ||
        item.product.name.toLowerCase().includes(lower) ||
        item.stock.detail.toLowerCase().includes(lower),
    );
  }, [filterValue, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // ✅ 3. เพิ่ม Config สำหรับ Selection
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true, // เปิดใช้งานการเลือก
    state: {
      sorting,
      rowSelection, // ส่ง state เข้าไป
    },
  });

  /* Export CSV ด้วย PapaParse */
  /* Export CSV ด้วย PapaParse */
  const handleExportCSV = () => {
    // ✅ 4. ปรับ Logic การดึงข้อมูล
    // ถ้ามีการเลือก Row ให้ดึงเฉพาะที่เลือก ถ้าไม่มีให้ดึงทั้งหมดที่ Filter อยู่
    const selectedRowModel = table.getSelectedRowModel().rows;

    // ตรวจสอบว่ามีการเลือกหรือไม่
    const hasSelection = selectedRowModel.length > 0;

    // ถ้ามีการเลือก ให้ดึง .original จาก row object
    // ถ้าไม่มีการเลือก ให้ใช้ filteredData ตรงๆ
    const sourceData = hasSelection
      ? selectedRowModel.map((row) => row.original)
      : filteredData;

    if (!sourceData.length) return;

    // map ข้อมูล (Logic เดิมของคุณ แต่เปลี่ยนตัวแปรต้นทางเป็น sourceData)
    const exportData = sourceData.map((item: any) => ({
      วันที่สั่งซื้อ: format(item.createdAt, "dd/MM/yyyy HH:mm") ,
      ชื่อสินค้า: item.product.name,
      รายละเอียด: item.stock.detail,
      ราคา: item.product.price,
    }));

    const csv = Papa.unparse(exportData, {
      quotes: true,
      delimiter: ",",
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // เปลี่ยนชื่อไฟล์เล็กน้อยเพื่อให้รู้ว่าโหลดแบบไหน
    a.download = hasSelection ? "selected_export.csv" : "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFile = () => {
    // 1. ดึงข้อมูลแถวที่ถูกเลือก (Check)
    const selectedRowModel = table.getSelectedRowModel().rows;

    // 2. ตรวจสอบว่ามีการเลือกหรือไม่
    const hasSelection = selectedRowModel.length > 0;

    // 3. ถ้ามีการเลือก ให้ดึงข้อมูลจากแถวที่เลือก (ต้อง .original)
    // ถ้าไม่มี ให้ใช้ filteredData ทั้งหมด
    const sourceData = hasSelection
      ? selectedRowModel.map((row) => row.original)
      : filteredData;

    if (!sourceData.length) return; // กันไว้เผื่อไม่มีข้อมูลเลย

    // 4. map ข้อมูลจาก sourceData ที่เราเตรียมไว้
    const text = sourceData.map((item: any) => item.stock.detail).join("\n"); // แยกบรรทัด

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // เปลี่ยนชื่อไฟล์นิดหน่อยให้รู้ว่าโหลดแบบเลือกมา
    a.download = hasSelection ? "selected_combo.txt" : "combo.txt";

    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-end py-4 gap-3">
        <Input
          placeholder="ค้นหา รหัสสินค้า / ชื่อสินค้า / รายละเอียด..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm focus"
        />

        <Button onClick={handleExportCSV} className="btn-main">
          {/* เปลี่ยนข้อความปุ่มให้ User เข้าใจง่ายขึ้น (Optional) */}
          {Object.keys(rowSelection).length > 0
            ? `ดาวน์โหลดที่เลือก (${Object.keys(rowSelection).length})`
            : "ดาวน์โหลด CSV ทั้งหมด"}
        </Button>

        <Button onClick={downloadFile} className="btn-main">
          {Object.keys(rowSelection).length > 0
            ? `ดาวน์โหลด Combo ที่เลือก (${Object.keys(rowSelection).length})`
            : "ดาวน์โหลด Combo ทั้งหมด"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className="bg-white shadow">
          <TableHeader className="text-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="cursor-pointer">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-lg">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">จำนวนแถวต่อหน้า:</span>
          <select
            className="border rounded px-2 py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">
            หน้าที่ {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ย้อนกลับ
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  );
}
