import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Delete: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.option.delete({
            where: {
                id: req.params.id
            }
        });
        return res.json({
            msg: "Option deleted successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in deleted Option",
            data: error
        });
    }
};

export default Delete;
