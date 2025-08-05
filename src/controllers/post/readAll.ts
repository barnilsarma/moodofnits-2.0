import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const getAllPosts: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let currentUserId: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const firebaseAuth = Utils.Firebase.getFirebaseAuth();
        const decoded = await firebaseAuth.verifyIdToken(token);

        const firebaseUser = await prisma.user.findUnique({
          where: { firebaseId: decoded.uid },
        });

        if (firebaseUser) {
          currentUserId = firebaseUser.id;
        }
      } catch (err) {
        console.warn("Invalid token, treating as guest user");
      }
    }
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true },
        },
        likedBy: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : false,
      },
    });
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.asset,
      likes: Number(post.likes),
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        name: post.author.name,
      },
      likedByCurrentUser: !!(currentUserId && post.likedBy.length > 0),
    }));

    return res.json(Utils.Response.success(formattedPosts, 200));
  } catch (err) {
    console.error("Get posts error:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default getAllPosts;
