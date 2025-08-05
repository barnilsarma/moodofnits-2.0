import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const readAllComments: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const { postId } = req.params;

    const allComments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: true,
      },
    });

    const commentMap = new Map();
    const rootComments: any[] = [];

    allComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    allComments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return res.json(Utils.Response.success(rootComments, 200));
  } catch (err) {
    console.error("Error reading comments:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default readAllComments;
