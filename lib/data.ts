import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export const getPresensiByUserId = async (params?: {
  month?: number;
  year?: number;
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized Access");
  }

  const now = new Date();
  const month = params?.month ?? now.getMonth();
  const year = params?.year ?? now.getFullYear();

  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  try {
    const result = await prisma.presensi.findMany({
      where: {
        userId: session.user.id,
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        tanggal: "desc",
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};