import { requireAdmin } from "../requireAdmin";
import prisma from "./conn";

// --- Types Definition ---
type DailySalesResult = {
  total_sales_today: bigint | number | null;
};

type UserCountResult = {
  amount_users: bigint | number;
};

type CountResult = {
  cnt: bigint;
};

// Type ของข้อมูลที่จะส่งกลับไปหน้า Frontend
type MarketingDataResponse = {
  sales: {
    today: number;
  };
  users: {
    today: number;
    thisWeek: number;
  };
  coupons: {
    total: number; // จำนวนคูปองทั้งหมดที่มี (Code + Discount)
    used: number; // จำนวนที่ใช้หมดแล้ว (Code + Discount)
    display: string; // format "used/total"
  };
};

const identifyWebsite = process.env.IDENTIFY_WEBSITE || "default_site";

export async function getMarketingData(): Promise<MarketingDataResponse | null> {
  try {
    const canuse = await requireAdmin();
    if (!canuse) {
      return null;
    }

    // --- Prepare Queries (เตรียมคำสั่งรอไว้ ยังไม่ await) ---

    // 1. ยอดขายวันนี้
    const salesPromise = prisma.$queryRaw<DailySalesResult[]>`
        WITH hb AS (
            SELECT websiteId, SUM(price) AS total_normal
            FROM HistoryBuy
            WHERE websiteId = ${identifyWebsite}
                AND createdAt >= CURDATE()
                AND createdAt < CURDATE() + INTERVAL 1 DAY
            GROUP BY websiteId
        ),
        hba AS (
            SELECT websiteId, SUM(price) AS total_app
            FROM HistoryBuyAppPremium
            WHERE websiteId = ${identifyWebsite}
                AND createdAt >= CURDATE()
                AND createdAt < CURDATE() + INTERVAL 1 DAY
            GROUP BY websiteId
        ),
        hbo AS (
            SELECT websiteId, SUM(price) AS total_order
            FROM HistoryBuyOrderProducts
            WHERE websiteId = ${identifyWebsite}
                AND createdAt >= CURDATE()
                AND createdAt < CURDATE() + INTERVAL 1 DAY
                AND status != "cancel"
            GROUP BY websiteId
        )
        SELECT 
            COALESCE((SELECT total_normal FROM hb), 0) + 
            COALESCE((SELECT total_app FROM hba), 0) + 
            COALESCE((SELECT total_order FROM hbo), 0) AS total_sales_today
        FROM Websites w
        WHERE w.id = ${identifyWebsite};
    `;

    // 2. คนสมัครใหม่สัปดาห์นี้ (YEARWEEK(..., 0) คือเริ่มวันอาทิตย์)
    const newRegisWeekPromise = prisma.$queryRaw<UserCountResult[]>`
        SELECT COUNT(u.id) AS amount_users
        FROM Websites w
        LEFT JOIN Users u ON u.websiteId = w.id
        AND YEARWEEK(u.createdAt, 0) = YEARWEEK(NOW(), 0)
        WHERE w.id = ${identifyWebsite}
        GROUP BY w.id;
    `;

    // 3. คนสมัครใหม่วันนี้
    const newRegisTodayPromise = prisma.$queryRaw<UserCountResult[]>`
        SELECT COUNT(u.id) AS amount_users
        FROM Websites w
        LEFT JOIN Users u ON u.websiteId = w.id
        AND u.createdAt >= CURDATE()
        AND u.createdAt < CURDATE() + INTERVAL 1 DAY
        WHERE w.id = ${identifyWebsite}
        GROUP BY w.id;
    `;

    // 4. จำนวนคูปองทั้งหมด (Prisma Aggregate)
    const totalCouponCodePromise = prisma.code.count({
      where: { websiteId: identifyWebsite },
    });
    const totalDiscountCodePromise = prisma.discountCode.count({
      where: { websiteId: identifyWebsite },
    });

    // 5. คูปองที่ใช้หมดแล้ว (Raw Query)
    const usedCouponCodePromise = prisma.$queryRaw<CountResult[]>`
        SELECT COUNT(*) as cnt FROM Code 
        WHERE websiteId = ${identifyWebsite} AND currentUse >= maxUse
    `;
    const usedDiscountCodePromise = prisma.$queryRaw<CountResult[]>`
        SELECT COUNT(*) as cnt FROM DiscountCode 
        WHERE websiteId = ${identifyWebsite} AND currentUse >= maxUse
    `;

    // --- Execute All Queries Parallel (รันพร้อมกันทุกตัว เร็วขึ้นมาก) ---
    const [
      salesRes,
      usersWeekRes,
      usersTodayRes,
      totalCode,
      totalDiscount,
      usedCodeRes,
      usedDiscountRes,
    ] = await Promise.all([
      salesPromise,
      newRegisWeekPromise,
      newRegisTodayPromise,
      totalCouponCodePromise,
      totalDiscountCodePromise,
      usedCouponCodePromise,
      usedDiscountCodePromise,
    ]);

    // --- Process Data & Convert BigInt ---

    // 1. Sales
    const totalSales = salesRes[0] ? Number(salesRes[0].total_sales_today) : 0;

    // 2. Users
    const usersThisWeek = usersWeekRes[0]
      ? Number(usersWeekRes[0].amount_users)
      : 0;
    const usersToday = usersTodayRes[0]
      ? Number(usersTodayRes[0].amount_users)
      : 0;

    // 3. Coupons
    const totalAllCoupons = totalCode + totalDiscount;
    const usedAllCoupons =
      Number(usedCodeRes[0]?.cnt || 0) + Number(usedDiscountRes[0]?.cnt || 0);

    // --- Return Final Object ---
    return {
      sales: {
        today: totalSales,
      },
      users: {
        today: usersToday,
        thisWeek: usersThisWeek,
      },
      coupons: {
        total: totalAllCoupons,
        used: usedAllCoupons,
        display: `${usedAllCoupons}/${totalAllCoupons}`, // เอาไปโชว์หน้าเว็บได้เลย "45/100"
      },
    };
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    // Return Default 0 values
    return {
      sales: { today: 0 },
      users: { today: 0, thisWeek: 0 },
      coupons: { total: 0, used: 0, display: "0/0" },
    };
  }
}

type TopSpender = {
  websiteId: string;
  userId: string;
  username: string;
  total_topup: bigint | number;
  topup_count: bigint | number;
  last_topup_at: Date;
};

export async function richMan() {
  try {
    const canuse = await requireAdmin();
    if (!canuse) {
      return [];
    }

    const topSpendersRaw = await prisma.$queryRaw<TopSpender[]>`
  SELECT
    ht.websiteId,
    u.id AS userId,
    u.username,
    SUM(ht.amount) AS total_topup,
    COUNT(*) AS topup_count,
    MAX(ht.createdAt) AS last_topup_at
  FROM HistoryTopup ht
  JOIN Users u ON u.id = ht.userId
  WHERE ht.websiteId = ${identifyWebsite}  -- <--- ใส่ตัวแปรตรงนี้
  GROUP BY ht.websiteId, u.id, u.username
  ORDER BY total_topup DESC, topup_count DESC
  LIMIT 3; -- แนะนำให้ limit ด้วยเพื่อความเร็ว
`;
    return topSpendersRaw;
  } catch (error) {
    console.log("Error richMan: ", error);
    return [];
  }
}

// 1. Type สำหรับรับค่าจาก Database (Raw)
type OldStockRaw = {
  productId: string;
  product_name: string;
  amount_stuck: bigint; // รับเป็น bigint
  oldest_stock_date: Date;
  max_days_stuck: number;
};

// 2. Type สำหรับส่งกลับ Frontend (Clean)
type OldStockResult = {
  productId: string;
  product_name: string;
  amount_stuck: number; // แปลงเป็น number แล้ว
  oldest_stock_date: Date;
  max_days_stuck: number;
};

export async function deadStock(): Promise<OldStockResult[]> {
  try {
    const canuse = await requireAdmin();
    if (!canuse) {
      return [];
    }

    const dead = await prisma.$queryRaw<OldStockRaw[]>`
        SELECT
          p.name AS product_name,                
          s.productId,
          COUNT(s.id) AS amount_stuck,           
          MIN(s.createdAt) AS oldest_stock_date, 
          MAX(TIMESTAMPDIFF(DAY, s.createdAt, NOW())) AS max_days_stuck
        FROM Stocks s
        JOIN Products p ON p.id = s.productId   
        WHERE s.status = 1
          AND s.createdAt < NOW() - INTERVAL 15 DAY
          AND s.websiteId = ${identifyWebsite}
        GROUP BY s.productId, p.name            
        ORDER BY amount_stuck DESC
    `;

    // 3. แปลงข้อมูลก่อน Return (สำคัญมาก!)
    const result: OldStockResult[] = dead.map((item) => ({
      productId: item.productId,
      product_name: item.product_name,
      amount_stuck: Number(item.amount_stuck), // แปลง BigInt -> Number
      oldest_stock_date: item.oldest_stock_date,
      max_days_stuck: Number(item.max_days_stuck), // บางที MySQL อาจคืนค่านี้เป็น BigInt ในบาง version กันไว้ก่อน
    }));

    return result;
  } catch (error) {
    console.log("Error deadStock: ", error);
    return [];
  }
}

// Helper function: หาวันจันทร์ของสัปดาห์นี้
function getStartOfWeek() {
  const d = new Date();
  const day = d.getDay();
  // ปรับให้วันจันทร์เป็นวันแรก (ถ้า day=0 คือวันอาทิตย์ ให้ลบ 6 วัน, ไม่งั้นลบ day-1)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export async function getWeeklySalesChart() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return null;

    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7); // บวกไป 7 วันเพื่อจบวันอาทิตย์

    // 1. ดึงข้อมูลดิบจาก DB (ใช้ Union All ผ่าน Raw Query จะเร็วกว่าแยก 3 query)
    // เราไม่จำเป็นต้อง Join วันเปล่าใน SQL, เดี๋ยวมา map เอาใน JS เร็วกว่า
    const rawSales = await prisma.$queryRaw<{ d: Date; revenue: number }[]>`
      SELECT DATE(createdAt) as d, SUM(price) as revenue
      FROM (
        SELECT createdAt, price FROM HistoryBuy 
        WHERE websiteId = ${identifyWebsite} AND createdAt >= ${startOfWeek} AND createdAt < ${endOfWeek}
        
        UNION ALL
        
        SELECT createdAt, price FROM HistoryBuyOrderProducts 
        WHERE websiteId = ${identifyWebsite} AND createdAt >= ${startOfWeek} AND createdAt < ${endOfWeek} AND status != "cancel"
        
        UNION ALL
        
        SELECT createdAt, price FROM HistoryBuyAppPremium 
        WHERE websiteId = ${identifyWebsite} AND createdAt >= ${startOfWeek} AND createdAt < ${endOfWeek}
      ) as AllSales
      GROUP BY DATE(createdAt)
    `;

    // 2. สร้างโครง Array 7 วัน (จันทร์ - อาทิตย์) เตรียมไว้
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // 3. Map ข้อมูลใส่ Array
    const chartData = days.map((dayName, index) => {
      // สร้างวันที่ของวันนั้นๆ
      const currentLoopDate = new Date(startOfWeek);
      currentLoopDate.setDate(currentLoopDate.getDate() + index);
      const dateString = currentLoopDate.toISOString().split("T")[0]; // "2023-10-25"

      // หาว่าใน DB มีข้อมูลของวันนี้ไหม (เทียบ String วันที่)
      // *ระวังเรื่อง Timezone: ปกติ DATE(createdAt) ใน SQL กับ JS Local Time อาจเหลื่อมกัน
      // ถ้า Server เป็น UTC ทั้งคู่ โค้ดนี้ใช้ได้เลย
      const found = rawSales.find(
        (s) => new Date(s.d).toISOString().split("T")[0] === dateString,
      );

      return {
        name: dayName, // ชื่อวันสำหรับแกน X กราฟ
        date: dateString, // วันที่เต็ม
        total: found ? Number(found.revenue) : 0, // ถ้าเจอใส่ยอด ถ้าไม่เจอใส่ 0
      };
    });

    return chartData;
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    return [];
  }
}

// Type สำหรับรับค่า
type TopProductRaw = {
  productName: string;
  categoryName: string;
  sold_count: bigint;
  revenue: number; // ปกติ SUM price ถ้า field เป็น Decimal/Float จะได้ number, ถ้า Int จะได้ bigint
};

// Type สำหรับส่งออก
type TopProductResult = {
  productName: string;
  categoryName: string;
  sold_count: number;
  revenue: number;
};

export async function getTop5Products() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return [];

    const topProducts = await prisma.$queryRaw<TopProductRaw[]>`
      SELECT
        p.name AS productName,
        c.name AS categoryName,
        COUNT(hb.id) AS sold_count,
        SUM(hb.price) AS revenue
      FROM HistoryBuy hb
      JOIN Products p ON p.id = hb.productId
      JOIN Categories c ON c.id = p.categoryId
      WHERE hb.websiteId = ${identifyWebsite}
        AND hb.createdAt >= NOW() - INTERVAL 60 DAY
      GROUP BY hb.productId, p.name, c.name
      ORDER BY revenue DESC
      LIMIT 5;
    `;

    // แปลงข้อมูล (BigInt -> Number)
    const result: TopProductResult[] = topProducts.map((item) => ({
      productName: item.productName,
      categoryName: item.categoryName,
      sold_count: Number(item.sold_count),
      revenue: Number(item.revenue),
    }));

    return result;
  } catch (error) {
    console.error("Error fetching top 5 products:", error);
    return [];
  }
}

export type Top5Apps = {
  app_name: string;
  sold_count: number;
  revenue: number;
};

export async function getTop5AppPremiums() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return [];

    const topProducts = await prisma.$queryRaw<Top5Apps[]>`
      SELECT
        ap.name AS app_name,
        COUNT(hb.id) AS sold_count,
        SUM(hb.price) AS revenue
      FROM HistoryBuyAppPremium hb
      JOIN AppPremiums ap ON hb.appPremiumId = ap.id
      WHERE hb.websiteId = ${identifyWebsite}
      GROUP BY hb.appPremiumId, ap.name
      ORDER BY revenue DESC
      LIMIT 5;
    `;
    // แปลงข้อมูล (BigInt -> Number)
    const result: Top5Apps[] = topProducts.map((item) => ({
      app_name: item.app_name,
      sold_count: Number(item.sold_count),
      revenue: Number(item.revenue.toFixed(2)),
    }));

    return result;
  } catch (error) {
    console.error("Error getTop5AppPremiums:", error);
    return [];
  }
}

export type Top5Order = {
  app_name: string;
  sold_count: number;
  revenue: number;
};

export async function getTop5Orders() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return [];

    const topProducts = await prisma.$queryRaw<Top5Order[]>`
            SELECT
        op.name AS app_name,
        COUNT(hb.id) AS sold_count,
        SUM(hb.price) AS revenue
      FROM HistoryBuyOrderProducts hb
      JOIN OrderPackages op ON hb.orderPackageId = op.id
      WHERE hb.websiteId = ${identifyWebsite} AND hb.status != "cancel"
      GROUP BY hb.orderPackageId, op.name
      ORDER BY revenue DESC
      LIMIT 5;
    `;
    // แปลงข้อมูล (BigInt -> Number)
    const result: Top5Apps[] = topProducts.map((item) => ({
      app_name: item.app_name,
      sold_count: Number(item.sold_count),
      revenue: Number(item.revenue.toFixed(2)),
    }));

    return result;
  } catch (error) {
    console.error("Error getTop5AppPremiums:", error);
    return [];
  }
}

export async function getAllHistory() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return [];

    // 1. ดึงข้อมูลสินค้าทั่วไป (เพิ่มเงื่อนไขวันที่)
    const hp = await prisma.historyBuy.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        product: { select: { name: true } },
        stock: { select: { detail: true } },
      },
    });

    // 2. ดึงข้อมูลแอปพรีเมียม (เพิ่มเงื่อนไขวันที่)
    const hap = await prisma.historyBuyAppPremium.findMany({
      where: {
        websiteId: identifyWebsite,
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        info: true,
        appPremium: { select: { name: true } },
      },
    });

    // 3. ดึงข้อมูล Order Product (เพิ่มเงื่อนไขวันที่)
    const ho = await prisma.historyBuyOrderProducts.findMany({
      where: {
        websiteId: identifyWebsite,
        status: {
          in: ["success", "pending"],
        },
      },
      include: { orderPackage: true },
    });

    // --- รวมข้อมูลและปรับ Format ให้เหมือนกัน ---
    const report = [
      ...hp.map((item) => ({
        id: item.id,
        type: "ทั่วไป",
        name: item.product?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.stock?.detail || "-",
        status: "SUCCESS",
        createdAt: item.createdAt,
      })),
      ...hap.map((item) => ({
        id: item.id,
        type: "แอปพรีเมียม",
        name: item.appPremium?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.info || "-",
        status: "SUCCESS",
        createdAt: item.createdAt,
      })),
      ...ho.map((item) => ({
        id: item.id,
        type: "ออเดอร์",
        name: item.orderPackage?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.reason || "-",
        status: item.status,
        createdAt: item.createdAt,
      })),
    ];

    return report.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.log("Error getAllHistory: ", error);
    return [];
  }
}

export async function getAllHistoryฺByMonth(month: string, year: string) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return [];

    // --- คำนวณวันที่เริ่มต้นและสิ้นสุดของเดือนนี้ ---
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    // เงื่อนไขวันที่สำหรับ Prisma
    const dateFilter = {
      gte: startDate,
      lte: endDate,
    };

    // 1. ดึงข้อมูลสินค้าทั่วไป (เพิ่มเงื่อนไขวันที่)
    const hp = await prisma.historyBuy.findMany({
      where: {
        websiteId: identifyWebsite,
        createdAt: dateFilter, // 👈 กรองเดือนนี้
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        product: { select: { name: true } },
        stock: { select: { detail: true } },
      },
    });

    // 2. ดึงข้อมูลแอปพรีเมียม (เพิ่มเงื่อนไขวันที่)
    const hap = await prisma.historyBuyAppPremium.findMany({
      where: {
        websiteId: identifyWebsite,
        createdAt: dateFilter, // 👈 กรองเดือนนี้
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        info: true,
        appPremium: { select: { name: true } },
      },
    });

    // 3. ดึงข้อมูล Order Product (เพิ่มเงื่อนไขวันที่)
    const ho = await prisma.historyBuyOrderProducts.findMany({
      where: {
        websiteId: identifyWebsite,
        createdAt: dateFilter, // 👈 กรองเดือนนี้
        status: {
          in: ["success", "pending"],
        },
      },
      include: { orderPackage: true },
    });

    // --- รวมข้อมูลและปรับ Format ให้เหมือนกัน ---
    const report = [
      ...hp.map((item) => ({
        id: item.id,
        type: "ทั่วไป",
        name: item.product?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.stock?.detail || "-",
        status: "SUCCESS",
        createdAt: item.createdAt,
      })),
      ...hap.map((item) => ({
        id: item.id,
        type: "แอปพรีเมียม",
        name: item.appPremium?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.info || "-",
        status: "SUCCESS",
        createdAt: item.createdAt,
      })),
      ...ho.map((item) => ({
        id: item.id,
        type: "ออเดอร์",
        name: item.orderPackage?.name || "ไม่ระบุชื่อ",
        price: item.price,
        detail: item.reason || "-",
        status: item.status,
        createdAt: item.createdAt,
      })),
    ];

    return report.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.log("Error getAllHistory: ", error);
    return [];
  }
}

export async function getTopupForDashboard() {
  try {
    const canuser = await requireAdmin();
    if (!canuser) {
      return { today: 0, week: 0 };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // เริ่มต้นวัน

    // ยอดเติมเงินวันนี้
    const todayTopup = await prisma.historyTopup.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: today, // ตั้งแต่ 00:00 ของวันนี้
        },
        websiteId: identifyWebsite,
      },
    });

    // ยอดเติมเงินสัปดาห์นี้ (เริ่มจากวันจันทร์)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthlyTopup = await prisma.historyTopup.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
        websiteId: identifyWebsite,
      },
    });

    return {
      today: todayTopup._sum.amount || 0,
      monthly: monthlyTopup._sum.amount || 0,
    };
  } catch (error) {
    console.error("getTopupForDashboard Error:", error);
    return { today: 0, week: 0 };
  }
}

export async function getSOLDForDashboard() {
  try {
    const canUse = await requireAdmin();
    if (!canUse) {
      return {
        success: false,
        message: "ไม่สำเร็จ",
        today: 0,
        monthly: 0,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const soldNormalProduct = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: today },
        websiteId: identifyWebsite,
      },
    });
    const soldAppPremiums = await prisma.historyBuyAppPremium.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: today },
        websiteId: identifyWebsite,
      },
    });
    const soldOrder = await prisma.historyBuyOrderProducts.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: today },
        websiteId: identifyWebsite,
        status: {
          in: ["success", "pending"],
        },
      },
    });

    const monthlySoldNormalProduct = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: firstDayOfMonth },
        websiteId: identifyWebsite,
      },
    });
    const monthlySoldAppPremiums = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: firstDayOfMonth },
        websiteId: identifyWebsite,
      },
    });
    const monthlySoldOrder = await prisma.historyBuy.aggregate({
      _count: { _all: true },
      where: {
        createdAt: { gte: firstDayOfMonth },
        websiteId: identifyWebsite,
      },
    });

    return {
      today:
        soldNormalProduct._count._all +
          soldAppPremiums._count._all +
          soldOrder._count._all || 0,
      monthly:
        monthlySoldNormalProduct._count._all +
          monthlySoldAppPremiums._count._all +
          monthlySoldOrder._count._all || 0,
    };
  } catch (error) {
    console.error("getSOLDForDashboard Error:", error);
    return { today: 0, week: 0 };
  }
}

export async function revenueRatio() {
  try {
    const canuse = await requireAdmin();
    if (!canuse) {
      return {
        name: ["สินค้าทั่วไป", "สินค้าแบบแอปพรีเมี่ยม", "สินค้าแบบพรีออเดอร์"],
        revNormal: 0,
        revApps: 0,
        revOrders: 0,
      };
    }
    const revNormal = await prisma.historyBuy.aggregate({
      where: {
        websiteId: identifyWebsite,
      },
      _sum: {
        price: true,
      },
    });
    const revApps = await prisma.historyBuyAppPremium.aggregate({
      where: {
        websiteId: identifyWebsite,
      },
      _sum: {
        price: true,
      },
    });
    const revOrders = await prisma.historyBuyOrderProducts.aggregate({
      where: {
        websiteId: identifyWebsite,
        status: {
          in: ["success", "pending"],
        },
      },
      _sum: {
        price: true,
      },
    });
    const result = {
      name: ["สินค้าทั่วไป", "สินค้าแบบแอปพรีเมี่ยม", "สินค้าแบบพรีออเดอร์"],
      revNormal: Number(revNormal._sum.price) ?? 0,
      revApps: Number(revApps._sum.price) ?? 0,
      revOrders: Number(revOrders._sum.price) ?? 0,
    };
    return result;
  } catch (error) {
    console.log("Error revenueRatio: ", error);
    return {
      name: ["สินค้าทั่วไป", "สินค้าแบบแอปพรีเมี่ยม", "สินค้าแบบพรีออเดอร์"],
      revNormal: 0,
      revApps: 0,
      revOrders: 0,
    };
  }
}
