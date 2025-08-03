import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Read: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.option.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        content: true,
        votes: true,
      },
    });
    return res.json({
      msg: "Option fetched successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in fetching Option",
      data: error,
    });
  }
};

export default Read;
