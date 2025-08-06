import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const positionIndex = (position: string): number => {
  const map: Record<string, number> = {
    GS: 0,
    VP: 1,
    GSC: 2,
    GSS: 3,
    GST: 4,
  };
  return map[position];
};

const voteSingle: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(Utils.Response.error("Authorization token required", 401));
    }

    const token = authHeader.split(" ")[1];
    const firebaseAuth = Utils.Firebase.getFirebaseAuth();

    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (err) {
      return next(Utils.Response.error("Invalid token", 401));
    }

    const { candidateId } = req.body;
    if (!candidateId) {
      return next(
        Utils.Response.error("Missing candidateId or exitPollId", 400)
      );
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decodedToken.uid },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { position: true },
    });

    if (!candidate) {
      return next(
        Utils.Response.error("Invalid candidate or mismatched poll", 400)
      );
    }

    const positionKey = candidate.position.name;
    const idx = positionIndex(positionKey);

    if (user.votes[idx] === "1") {
      return next(
        Utils.Response.error(`Already voted for ${positionKey}`, 400)
      );
    }

    await prisma.candidate.update({
      where: { id: candidateId },
      data: { votes: { increment: 1 } },
    });

    const updatedVotes = user.votes.split("");
    updatedVotes[idx] = "1";

    await prisma.user.update({
      where: { id: user.id },
      data: { votes: updatedVotes.join("") },
    });

    return res.json(
      Utils.Response.success(`Vote recorded for ${positionKey}`, 200)
    );
  } catch (err) {
    console.error("Error recording vote:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default voteSingle;
