import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Create: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { name, designation, description, positionId } = req.body;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        designation,
        description,
        positionId,
      },
    });

    return res.json({
      msg: "Candidate created successfully",
      data: candidate,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Problem in creating candidate",
      error,
    });
  }
};

export default Create;
