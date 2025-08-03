import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils";

const ReadAll: Interfaces.Controllers.Async = async (_req, res, next) => {
  try {
    const exitPolls = await prisma.exitPoll.findMany({
      include: {
        positions: {
          include: {
            candidates: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      msg: "Exit polls fetched successfully",
      data: exitPolls,
    });
  } catch (error) {
    console.error("Error fetching exit polls:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export default ReadAll;
