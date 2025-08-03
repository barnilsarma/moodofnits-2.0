import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Read: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.position.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        name: true,
        candidates: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json({
      msg: "Position fetched successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in fetching position",
      data: error,
    });
  }
};

export default Read;
