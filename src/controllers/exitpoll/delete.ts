//delete controller
import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Delete: Interfaces.Controllers.Async = async (req, res) => {
  try {
    await prisma.exitPoll.delete({
      where: { id: req.params.id },
    });

    return res.json({ msg: "Exit poll deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting exit poll", error });
  }
};

export default Delete;
