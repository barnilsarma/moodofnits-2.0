import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const ReadAll: Interfaces.Controllers.Async = async (_req, res) => {
  try {
    const action = await prisma.position.findMany({
      select: {
        name: true,
        candidates: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json({
      msg: "Positions fetched successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in fetching positions",
      data: error,
    });
  }
};

export default ReadAll;
