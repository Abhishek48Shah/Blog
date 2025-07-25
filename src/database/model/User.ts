import { PrismaClient } from "@prisma/client";
import asyncWrapper from "../../helper/asyncWrapper";
import { RoleType } from "../../helper/role";
const prisma = new PrismaClient();
const User = {
  getByEmail: async (value: string) => {
    return await prisma.User.findUnique({
      where: { email: value },
    });
  },
  getInfo: async (id: string) => {
    return await prisma.User.findUnique({
      where: { id: value },
      select: { id: true, username: true, role: true },
    });
  },
  createNew: async ({ username, email, password }) => {
    return await prisma.User.create({
      data: {
        username: username,
        email: email,
        password: password,
        role: RoleType.GUEST,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  },
};
export default User;
