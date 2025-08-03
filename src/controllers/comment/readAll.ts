//to read all comments of a postimport * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import * as Utils from "src/utils";

const readAllComments: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return res.json(Utils.Response.success(comments, 200));
  } catch (err) {
    console.error("Error reading comments:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default readAllComments;
