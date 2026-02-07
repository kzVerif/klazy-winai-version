export async function mustOk<T extends { success: boolean; message?: string }>(
  p: Promise<T>
) {
  const res = await p;
  if (!res.success) throw new Error(res.message || "ทำรายการไม่สำเร็จ");
  return res;
}