import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const createUser: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authorizationHeader: string | undefined = req?.headers?.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return next(Utils.Response.error("Authorization token is required", 401));
    }

    const token: string = authorizationHeader.split(" ")[1];

    let decodedToken;
    const firebaseAuth = Utils.Firebase.getFirebaseAuth();
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (err) {
      console.error("Error verifying Firebase token:", err);
      return next(Utils.Response.error("Invalid or expired token", 401));
    }

    const uid = decodedToken.uid;
    const existingUser = await prisma.user.findUnique({
      where: { firebaseId: uid },
    });

    if (existingUser) {
      return next(Utils.Response.error("User already exists", 409));
    }

    const { email, name } = decodedToken;
    const { username } = req.body;

    if (!email || !name || !username) {
      return next(Utils.Response.error("Missing required fields", 400));
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        firebaseId: uid,
        votes: "00000",
      },
    });

    return res.json(Utils.Response.success(user, 201));
  } catch (err) {
    console.error("Error creating user:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default createUser;
