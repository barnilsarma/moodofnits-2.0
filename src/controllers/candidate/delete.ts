import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Delete: Interfaces.Controllers.Async = async (req, res) => {
  try {
    await prisma.candidate.delete({
      where: { id: req.params.id },
    });

    return res.json({ msg: "Candidate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting candidate", error });
  }
};

export default Delete;
