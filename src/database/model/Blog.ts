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
  getAll: async (query: string) => {
    return await prisma.Blog.findMany({
      where: { title: query, status: "published" },
    });
  },
};
export default Blog;
