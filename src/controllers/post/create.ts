import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { type, question, title, description, likes, authorId } = req.body;
    const asset = req.file && (req.file as Express.MulterS3.File).location;
    const post = await prisma.post.create({
      data: {
        type,
        question,
        title,
        description,
        likes: Number(likes) || 0,
        asset: asset,
        authorId,
      },
    });

    return res.json({
      msg: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      msg: "Problem in creating post",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export default Create;
