import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export const getPresensiByUserId = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized Access");
    }
    try {
        const result = await prisma.presensi.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                user: true
            },
            orderBy: {
                created_at: "desc"
            }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}