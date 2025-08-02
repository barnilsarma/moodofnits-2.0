import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const ReadAll: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.option.findMany({
            where: {
                postId: req.params.postId
            },
            select:{
                content: true,
                votes: true
            }
        });
        return res.json({
            msg: "Options fetched successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in fetching Options",
            data: error
        });
    }
};

export default ReadAll;
