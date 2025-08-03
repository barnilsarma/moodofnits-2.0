import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Read: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        type: true,
        question: true,
        title: true,
        options: true,
        asset: true,
        description: true,
        likes: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        Comment: {
          select: {
            id: true,
            content: true,
            author: true,
            createdAt: true,
            updatedAt: true,
            likes: true,
            replies: true,
          },
        },
      },
    });
    return res.json({
      msg: "Post fetched successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in fetching post",
      data: error,
    });
  }
};

export default Read;
