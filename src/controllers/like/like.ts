import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const likePost: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(Utils.Response.error("Authorization token required", 401));
    }

    const token = authHeader.split(" ")[1];
    const firebaseAuth = Utils.Firebase.getFirebaseAuth();
    const decoded = await firebaseAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    const { postId } = req.params;

    if (!postId) {
      return next(Utils.Response.error("Post ID is required", 400));
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return next(Utils.Response.error("Post not found", 404));
    }

    const alreadyLiked = await prisma.like.findUnique({
      where: {
        userPostUnique: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (alreadyLiked) {
      return next(Utils.Response.error("Post already liked", 400));
    }

    await prisma.like.create({
      data: {
        user: { connect: { id: user.id } },
        post: { connect: { id: postId } },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    return res.json(Utils.Response.success("Post liked successfully", 200));
  } catch (err) {
    console.error("Like error:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default likePost;
