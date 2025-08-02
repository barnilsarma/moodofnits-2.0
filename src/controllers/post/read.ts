import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const Read: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.post.findUnique({
            where: {
                id: req.params.id
            },
            select:{
                type: true,
                question: true,
                title: true,
                options: true,
                asset: true,
                description: true,
                likes: true,
                authorId: true,
                createdAt: true, 
                updatedAt: true,
                Comment:{
                    select:{
                        id: true,
                        content: true,
                        author:true,
                        createdAt: true,
                        updatedAt: true,
                        likes:true,
                        replies:true
                    }
                }
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

export default Read;
