import * as Interfaces from "../../interfaces";
import {prisma} from "../../utils/index";
const ReadAll: Interfaces.Controllers.Async = async (req, res) => {
    try{
        const action=await prisma.post.findMany({
            select:{
                type: true,
                question: true,
                title: true,
                options: true,
                asset: true,
                likes: true,
                author: {
                    select: {
                        id: true,
                        username:true
                    }
                },
                createdAt: true, 
                updatedAt: true,
            }
        });
        return res.json({
            msg: "Posts fetched successfully",
            data: action
        });
    }
    catch (error) {
        return res.json({
            msg:"Problem in fetching posts",
            data: error
        });
    }
};

export default ReadAll;
