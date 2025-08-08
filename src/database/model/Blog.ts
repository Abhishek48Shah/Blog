import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const Blog = {
  createNew: async ({ title, content, status, id }) => {
    return await prisma.Blog.create({
      data: {
        title: title,
        content: content,
        status: status,
        authorId: id,
      },
    });
  },
  delete: async (blogId: number) => {
    return await prisma.Blog.delete({ where: { id: blogId } });
  },
  edit: async (blogId: number) => {
    return await prisma.Blog.update({ where: { id: blogId } });
  },
  get: async (blogId: number) => {
    return await prisma.Blog.findUnique({ where: { id: blogId } });
  },
  getAll_By_UserId: async (userId: number) => {
    return await prisma.Blog.findMany({
      where: { authorId: userId, status: "published" },
      select: {
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  getSearch: async (query: string) => {
    return await prisma.Blog.findMany({
      where: { title: query, status: "published", mode: "insensitive" },
    });
  },
  getDraft: async (userId: number) => {
    return await prisma.Blog.findMany({
      where: { authorId: userId, status: "draft" },
    });
  },
  getFeeds: async (userId) => {
    return await prisma.Blog.findMany({
      where: {
        User: {
          followers: {
            some: {
              followingId: userId,
            },
          },
        },
      },
    });
  },
};
export default Blog;
