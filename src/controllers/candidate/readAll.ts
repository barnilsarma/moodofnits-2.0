import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const ReadAll: Interfaces.Controllers.Async = async (_req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        position: true,
      },
    });

    return res.json({ data: candidates });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching candidates", error });
  }
};

export default ReadAll;
