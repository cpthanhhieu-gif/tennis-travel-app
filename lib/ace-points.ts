export type PointKind = "tour" | "fei" | "share" | "opening";
export type PointEntry = { key: string; orderId: string; kind: PointKind; amount: number; createdAt: string };
export type PointOrder = { id: string; total: number; paid: number; points: number; completedAt?: string; feiRating?: number; feiResponses?: unknown[] };
export const POINT_LABELS: Record<PointKind, string> = { tour: "Hoàn thành tour", fei: "Hoàn thành FEI rating", share: "Chia sẻ thẻ", opening: "Số dư trước cập nhật" };
export function awardOnce(ledger: PointEntry[], order: PointOrder, kind: Exclude<PointKind, "opening">) {
  if (!order.completedAt) return 0;
  if (kind === "tour" && order.paid < order.total) return 0;
  if (kind === "fei" && !order.feiRating&&!order.feiResponses?.length) return 0;
  const key = `${order.id}:${kind}`;
  if (ledger.some(entry => entry.key === key)) return 0;
  const amount = kind === "tour" ? Math.floor(order.total * 2 / 100000) : kind === "fei" ? 20 : 10;
  ledger.push({ key, orderId: order.id, kind, amount, createdAt: new Date().toISOString() });
  order.points += amount;
  return amount;
}
