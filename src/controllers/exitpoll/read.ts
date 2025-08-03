//controller to read
import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Read: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const poll = await prisma.exitPoll.findUnique({
      where: { id: req.params.id },
      include: {
        positions: true,
      },
    });

    if (!poll) {
      return res.status(404).json({ msg: "Exit poll not found" });
    }

    return res.json({ data: poll });
  } catch (error) {
    return res.status(500).json({ msg: "Error reading exit poll", error });
  }
};

export default Read;
