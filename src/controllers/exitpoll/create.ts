import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils";

const Create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { name, positionName } = req.body;

    if (!name || !positionName) {
      return next({
        status: 400,
        message: "Both 'name' and 'positionName' are required",
      });
    }

    const validPositionNames = ["GS", "VP", "GSC", "GSS", "GST"];
    if (!validPositionNames.includes(positionName)) {
      return next({
        status: 400,
        message:
          "Invalid 'positionName'. Must be one of: GS, VP, GSC, GSS, GST",
      });
    }

    const exitPoll = await prisma.exitPoll.create({
      data: {
        name,
        positions: {
          create: {
            name: positionName,
          },
        },
      },
      include: {
        positions: true,
      },
    });

    return res.status(201).json({
      msg: "Exit poll created with one position",
      data: exitPoll,
    });
  } catch (error) {
    console.error("Error creating exit poll:", error);
    return next({
      status: 500,
      message: "Internal server error",
    });
  }
};

export default Create;
