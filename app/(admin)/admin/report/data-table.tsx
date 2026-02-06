"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    format(new Date(), "yyyy-MM"), // ค่าเริ่มต้นคือเดือนปัจจุบัน
  );

  const monthOptions = React.useMemo(() => {
    const months = data.map((item) =>
      format(new Date((item as any).createdAt), "yyyy-MM"),
    );
    return Array.from(new Set(months)).sort().reverse();
  }, [data]);

  const filteredByMonth = React.useMemo(() => {
    return data.filter((item: any) => {
      const itemDate = new Date(item.createdAt);
      return format(itemDate, "yyyy-MM") === selectedMonth;
    });
  }, [data, selectedMonth]);

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
    data: filteredByMonth,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // ✅ Sorting support
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  /* Export CSV ด้วย PapaParse */
  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const exportData = filteredData.map((item: any) => ({
      รหัสคำสั่งซื้อ: item.id,
      ชื่อสินค้า: item.name,
      ยอดขาย: item.price,
      วันที่ทำรายการ: format(item.createdAt, "dd/MM/yyyy HH:mm"),
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
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-end py-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">เลือกเดือน:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="เลือกเดือน" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => {
                // แปลงสตริง yyyy-MM กลับเป็น Object วันที่เพื่อใช้ format ภาษาไทย
                const date = new Date(`${m}-01`);
                return (
                  <SelectItem key={m} value={m}>
                    {/* 'MMMM yyyy' จะได้ผลลัพธ์เป็น 'มกราคม 2024' */}
                    {format(date, "MMMM yyyy", { locale: th })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSelectedMonth(format(new Date(), "yyyy-MM"))}
          >
            เดือนปัจจุบัน
          </Button>
        </div>
        <Button onClick={handleExportCSV} className="btn-main">
          ดาวน์โหลด CSV
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
                          header.getContext(),
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
            หน้าที่ {table.getState().pagination.pageIndex + 1}/
            {table.getPageCount()}
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
