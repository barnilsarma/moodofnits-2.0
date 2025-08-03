import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const readUser: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authorizationHeader: string | undefined = req?.headers?.authorization;
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
      include: {
        Post: true,
        Comment: true,
      },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    return res.json(Utils.Response.success(user, 200));
  } catch (err) {
    console.error("Error fetching user:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default readUser;
