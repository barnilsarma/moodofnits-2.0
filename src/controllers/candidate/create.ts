import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Create: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { name, designation, description, positionId } = req.body;
    const photoUrl = req.file && (req.file as Express.MulterS3.File).location;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        designation,
        description,
        positionId,
        photo: photoUrl || null,
      },
    });

    return res.json({
      msg: "Candidate created successfully",
      data: candidate,
    });
  } catch (error) {
    console.error("Create candidate error:", error); // helpful for debugging
    return res.status(500).json({
      msg: error,
      error: error instanceof Error ? error.message : error,
    });
  }
};

export default Create;
