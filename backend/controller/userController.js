
import prisma from "../prisma/db.config.js"
import z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../jwt_secret/config.js"

const parse = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    email: z.string().email().optional()
})


//signup
export const signUpUser = async (req, res) => {
    const { username, password, lastName, firstName, email } = req.body
    const success = parse.safeParse(req.body)
    console.log(success)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
                lastName: lastName,
                firstName: firstName,
                email: email
            }
        })


        const token = jwt.sign({
            userId: newUser.id
        }, JWT_SECRET)
        // res.cookie("token", token)
    

       await prisma.account.create({
       
        data:{
            userId:newUser.id,
            balance:1+Math.random()*10000
        }
       })


        return res.status(411).json({
            token: token, message: "user created successfully", user: newUser
        })

    }
    catch (err) {
        console.log(err)
        res.send("errors are" + err)
    }

}


//signin


export const signInUser = async (req, res) => {
    const { password, email } = req.body
    const success = parse.safeParse(req.body)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,

        });
    }
    try {
        const users = await prisma.user.findUnique({
            where: {
                password: password,
                email: email
            }

        })
        
        if (!users) {
            return res.status(404).json({
                message: "no user found"
            })
        }
        else {
             res.status(411).json({message:"signin successfully"})
        }
    }
    catch (err) {
        res.send("errors are" + err)
        console.log(`error found ${err}`)
    }
}

//update user


export const updateUser = async (req, res) => {

    const { id, username, password, email } = req.body
    const success = parse.safeParse(req.body)

    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,

        });
    }
    try {
        const allUser = prisma.user.findMany({
            where: {
                id: parseInt(id)
            }
        })
        if (!allUser) {
            return res.status(404).json({
                message: "no user found"
            })
        }
        else {
            const updateUser = await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    username: username,
                    password: password,
                    email: email
                }
            })
            res.status(411).json({
                message: "update user successfully", user: updateUser
            })

        }
    }
    catch (err) {
        res.send("error are " + err)
        console.log(err)
    }
}

//find user

export const findUser = async (req, res) => {
    const { username } = req.body
    const success = parse.safeParse(req.body)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }

    try {
        if (!username) {
            res.json({ message: "no such user" })
        }
        else {
           const user= await prisma.user.findFirst({
                where: {
                    username: username
                },
                select: {
                    username: true,
                    lastName:true,
                    firstName: true,
                    email:true
                }
            })
            res.status(411).json({
                user:user
            })
        }
    }
    catch (err) {
        res.json("error occured " + err)
        console.log(err)
    }
}