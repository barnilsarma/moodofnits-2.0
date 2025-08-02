import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Update: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.option.update({
            where: {
                id: req.params.id
            },
            data:{
                content: req.body.content,
                votes: req.body.votes
            }
        });
        return res.json({
            msg: "Option fetched successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in fetching Option",
            data: error
        });
    }
};

export default Update;
