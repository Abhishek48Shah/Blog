import { PrismaClient } from "@prisma/client";
import { RoleType } from "../../helper/role";
const prisma = new PrismaClient();
const User = {
  getByEmail: async (value: string) => {
    return await prisma.User.findUnique({
      where: { email: value },
    });
  },
  getInfo: async (id: number) => {
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
        role: RoleType.WRITER,
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
