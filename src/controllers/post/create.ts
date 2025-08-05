import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return next(Utils.Response.error("Authorization token is required", 401));
    }

    const token: string = authorizationHeader.split(" ")[1];
    const firebaseAuth = Utils.Firebase.getFirebaseAuth();

    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (err) {
      console.error("Error verifying Firebase token:", err);
      return next(Utils.Response.error("Invalid or expired token", 401));
    }
    const uid = decodedToken.uid;
    const user = await prisma.user.findUnique({
      where: { firebaseId: uid },
    });
    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }
    const { type, question, title, description, likes } = req.body;
    const allowedTypes = ["PHOTO", "VIDEO", "TEXT", "POLL"];

    if (!allowedTypes.includes(type)) {
      return next(Utils.Response.error("Invalid post type", 400));
    }
    const asset = req.file && (req.file as Express.MulterS3.File).location;
    const post = await prisma.post.create({
      data: {
        type,
        question,
        title,
        description,
        likes: Number(likes) || 0,
        asset,
        authorId: user.id,
      },
    });

    return res.json(
      Utils.Response.success({ msg: "Post created successfully", post }, 201)
    );
  } catch (err) {
    console.error("Error creating post:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default Create;
