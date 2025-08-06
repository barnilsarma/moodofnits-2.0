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

const updateVote: Interfaces.Controllers.Async = async (req, res, next) => {
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
      return next(Utils.Response.error("Missing candidateId", 400));
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decodedToken.uid },
    });

    if (!user) {
      return next(Utils.Response.error("User not found", 404));
    }

    const newCandidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { position: true },
    });

    if (!newCandidate) {
      return next(Utils.Response.error("Invalid candidate", 400));
    }

    const positionKey = newCandidate.position.name;
    const idx = positionIndex(positionKey);

    // If already voted for this candidate (same candidate, same position), return early
    const alreadyVoted = user.votes[idx] === "1";
    if (alreadyVoted) {
      // Check if the current candidate is the one they already voted for
      const candidates = await prisma.candidate.findMany({
        where: { positionId: newCandidate.positionId },
      });

      for (const candidate of candidates) {
        if (candidate.id !== newCandidate.id) {
          // Assuming one vote per position, this must have been the previously voted candidate
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: { votes: { decrement: 1 } },
          });

          await prisma.candidate.update({
            where: { id: newCandidate.id },
            data: { votes: { increment: 1 } },
          });

          return res.json(
            Utils.Response.success(`Vote changed to ${newCandidate.name}`, 200)
          );
        }
      }

      // If somehow already voted but can't find previous candidate, fallback
      return next(
        Utils.Response.error(`Already voted for ${positionKey}`, 400)
      );
    }

    // If no previous vote for this position
    await prisma.candidate.update({
      where: { id: newCandidate.id },
      data: { votes: { increment: 1 } },
    });

    // Update user's votes string
    const voteArr = user.votes.split("");
    voteArr[idx] = "1";

    await prisma.user.update({
      where: { id: user.id },
      data: { votes: voteArr.join("") },
    });

    return res.json(
      Utils.Response.success(`Vote cast for ${newCandidate.name}`, 200)
    );
  } catch (err) {
    console.error("Error updating vote:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default updateVote;
