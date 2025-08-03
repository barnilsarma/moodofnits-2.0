//controller for exitpoll
import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";

const Create: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const { positionIds } = req.body;

    const exitPoll = await prisma.exitPoll.create({
      data: {
        positions: {
          connect: positionIds.map((id: string) => ({ id })),
        },
      },
      include: {
        positions: true,
      },
    });

    return res.json({
      msg: "Exit poll created successfully",
      data: exitPoll,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error creating exit poll",
      error,
    });
  }
};

export default Create;
