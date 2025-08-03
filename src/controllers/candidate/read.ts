import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Read: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: req.params.id },
      include: {
        position: true,
      },
    });

    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    return res.json({ data: candidate });
  } catch (error) {
    return res.status(500).json({ msg: "Error reading candidate", error });
  }
};

export default Read;
