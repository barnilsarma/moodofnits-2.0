import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";

const readPositionVotes: Interfaces.Controllers.Async = async (
  req,
  res,
  next
) => {
  try {
    const { positionId } = req.body;

    if (!positionId) {
      return next(Utils.Response.error("positionId is required", 400));
    }

    const position = await prisma.position.findUnique({
      where: { id: positionId },
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
            designation: true,
            votes: true,
          },
        },
      },
    });

    if (!position) {
      return next(Utils.Response.error("Position not found", 404));
    }

    return res.json(
      Utils.Response.success(
        position.candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          designation: candidate.designation,
          votes: candidate.votes,
        }))
      )
    );
  } catch (err) {
    console.error("Error fetching position votes:", err);
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default readPositionVotes;
