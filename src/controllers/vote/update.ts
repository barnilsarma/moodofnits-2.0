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

    const { candidateId, exitPollId } = req.body;
    if (!candidateId || !exitPollId) {
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

    const newCandidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { position: true },
    });

    if (!newCandidate || newCandidate.position.exitPollId !== exitPollId) {
      return next(
        Utils.Response.error("Invalid candidate or mismatched poll", 400)
      );
    }

    const positionKey = newCandidate.position.name;
    const idx = positionIndex(positionKey);

    // Step 1: Find previous vote (if any) for this position
    const positionCandidates = await prisma.candidate.findMany({
      where: {
        positionId: newCandidate.positionId,
      },
    });

    for (const candidate of positionCandidates) {
      if (candidate.id !== newCandidate.id) {
        // Check if this candidate was previously voted by the user (based on `votes` string)
        if (user.votes[idx] === "1") {
          // We assume only one candidate could have had that vote
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: { votes: { decrement: 1 } },
          });
          break;
        }
      }
    }

    // Step 2: Increment vote of new candidate
    await prisma.candidate.update({
      where: { id: newCandidate.id },
      data: { votes: { increment: 1 } },
    });

    // Step 3: Update user vote string if they hadn't voted before
    let newVotesString = user.votes;
    if (user.votes[idx] === "0") {
      const voteArr = user.votes.split("");
      voteArr[idx] = "1";
      newVotesString = voteArr.join("");

      await prisma.user.update({
        where: { id: user.id },
        data: { votes: newVotesString },
      });
    }

    return res.json(
      Utils.Response.success(`Vote updated for ${positionKey}`, 200)
    );
  } catch (err) {
    console.error("Error updating vote:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default updateVote;
