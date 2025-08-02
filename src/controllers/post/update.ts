import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Update: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.post.update({
            where: {
                id: req.params.id
            },
            data:{
                question: req.body.question,
                title: req.body.title,
                description:req.body.description,
                likes: req.body.likes,
            }
        });
        return res.json({
            msg: "Post updated successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in updating post",
            data: error
        });
    }
};

export default Update;
