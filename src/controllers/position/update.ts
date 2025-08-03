import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Update: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.position.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
      },
    });
    return res.json({
      msg: "Position updated successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in updating position",
      data: error,
    });
  }
};

export default Update;
