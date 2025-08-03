import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Update: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { name, designation, description, positionId } = req.body;

    const updated = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        name,
        designation,
        description,
        positionId,
      },
    });

    return res.json({ msg: "Candidate updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating candidate", error });
  }
};

export default Update;
