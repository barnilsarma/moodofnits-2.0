//update controller
import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Update: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { positionIds } = req.body;

    const updated = await prisma.exitPoll.update({
      where: { id: req.params.id },
      data: {
        positions: {
          set: positionIds.map((id: string) => ({ id })),
        },
      },
      include: {
        positions: true,
      },
    });

    return res.json({
      msg: "Exit poll updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating exit poll", error });
  }
};

export default Update;
