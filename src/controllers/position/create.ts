import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Create: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.position.create({
            data: {
                name: req.body.name,
                exitPollId:req.body.exitPollId
            }
        });
        return res.json({
            msg: "Position created successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in creating post",
            data: error
        });
    }
};

export default Create;
