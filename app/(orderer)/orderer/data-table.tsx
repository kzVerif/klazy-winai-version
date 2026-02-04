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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

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

const filteredData = React.useMemo(() => {
    if (!filterValue) return data;

    const lower = filterValue.toLowerCase();

    return data.filter((item: any) => {
      // 1. แปลง Status จาก Eng -> Thai เพื่อให้ค้นหาเจอ
      // เทคนิค: เอาทั้งไทยและอังกฤษมาต่อกัน เพื่อให้ค้นได้ทั้งคำว่า "success" และ "สำเร็จ"
      let statusText = "";
      switch (item.status) {
        case "success":
          statusText = "สำเร็จ success";
          break;
        case "pending":
          statusText = "รอดำเนินการ pending";
          break;
        case "cancel":
          statusText = "ยกเลิก cancel";
          break;
        default:
          statusText = String(item.status); // กรณีมีสถานะอื่น
      }

      // 2. ทำการค้นหา (ใส่ String() ครอบ id ไว้ กัน Error กรณี id เป็นตัวเลข)
      return (
        String(item.id).toLowerCase().includes(lower) ||
        item.orderPackage?.name?.toLowerCase().includes(lower) || // ใส่ ?. กันพังถ้าไม่มีข้อมูล
        String(item.uid).toLowerCase().includes(lower) ||
        item.orderProduct?.name?.toLowerCase().includes(lower) ||
        statusText.toLowerCase().includes(lower) // 👈 ค้นหาจาก text ที่เราแปลงเมื่อกี้
      );
    });
  }, [filterValue, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // ✅ Sorting support
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });


  return (
    <div>
      <div className="flex items-center justify-end py-4 gap-3">
        <Input
          placeholder="ค้นหา รหัสสินค้า/ชื่อแพ็ค/ไอดีเกม/ชื่อสินค้า"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm focus"
        />
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
