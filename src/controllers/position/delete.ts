import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Delete: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.position.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      msg: "Position deleted successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in deleting position",
      data: error,
    });
  }
};

export default Delete;
