import * as Interfaces from "../../interfaces";
import { prisma } from "../../utils/index";
const Create: Interfaces.Controllers.Async = async (req, res) => {
  try {
    const action = await prisma.option.create({
      data: {
        content: req.body.content,
        post: {
          connect: {
            id: req.body.postId,
          },
        },
      },
    });
    return res.json({
      msg: "Option created successfully",
      data: action,
    });
  } catch (error) {
    return res.json({
      msg: "Problem in creating Option",
      data: error,
    });
  }
};

export default Create;
