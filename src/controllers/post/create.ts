import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Create: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.post.create({
            data: {
                type: req.body.type,
                question: req.body.question,
                title: req.body.title,
                asset: req.body.asset,
                description: req.body.description,
                likes:req.body.likes,
                authorId:req.body.authorId
            }
        });
        return res.json({
            msg: "Post created successfully",
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
