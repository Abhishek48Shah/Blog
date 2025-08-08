import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const follow = {
  addFollow: async (currentUserId: number, targetUserId: number) => {
    return await prisma.follow.create({
      data: { followerId: currentUserId, followingId: targetUserId },
    });
  },
  getFollowers: async (userId: number) => {
    return await prisma.follow.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });
  },
  getFollowing: async (userId: number) => {
    return await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
  },
};
export default follow;
