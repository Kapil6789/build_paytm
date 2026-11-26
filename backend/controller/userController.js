
import prisma from "../prisma/db.config.js"
import bcrypt from "bcrypt"
import z from "zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../jwt_secret/config.js"

const parse = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    balance: z.string().optional(),
})


//signup
export const signUpUser = async (req, res) => {
    const { username, password, lastName, firstName, balance } = req.body
    const success = parse.safeParse(req.body)
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }

    try {
        if (typeof password !== "string" || password.length === 0) {
            return res.status(400).json({ message: "Password is required." });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    password: passwordHash,
                    lastName,
                    firstName,
                    balance: parseInt(balance, 10),
                },
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    balance: true,
                },
            });

            await tx.account.create({
                data: {
                    userId: user.id,
                    balance: parseInt(balance, 10),
                },
            });

            return user;
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

        return res.status(200).json({
            token,
            message: "user created successfully",
            user: newUser,
        });
    }
    catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ message: "Could not create account." });
    }

}


//signin


export const signInUser = async (req, res) => {
    const { username, password } = req.body;
    const success = parse.safeParse(req.body);
    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,
        });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { username: username },
            select: {
                username: true,
                password: true,
                id: true
            }
        });
        
        if (!user || typeof password !== "string") {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isBcryptHash = /^\$2[aby]\$/.test(user.password);
        const passwordMatches = isBcryptHash
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Upgrade legacy plain-text rows on successful sign-in during rollout.
        if (!isBcryptHash) {
            const passwordHash = await bcrypt.hash(password, 12);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: passwordHash },
            });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        return res.status(200).json({
            token: token,
            message: "Sign in successfully"
        });
    }
    catch (err) {
        console.error("Error in signInUser:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

//update user


export const updateUser = async (req, res) => {

    const { id, username, password } = req.body
    const success = parse.safeParse(req.body)

    if (!success.success) {
        return res.status(400).json({
            message: "Input validation failed",
            errors: success.error.errors,

        });
    }
    try {
        const userId = parseInt(id, 10);
        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ message: "A valid user id is required." });
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({
                message: "no user found"
            })
        }
        else {
            const data = {};
            if (username !== undefined) data.username = username;
            if (password !== undefined) data.password = await bcrypt.hash(password, 12);

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data,
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    balance: true,
                },
            });
            return res.status(200).json({
                message: "update user successfully",
                user: updatedUser,
            });

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
        const user = await prisma.user.findFirst({
            where: { username: username },
            select: {
                username: true,
                lastName: true,
                id: true,
                firstName: true,
            }
        });
        if (!user) {
            return res.status(404).json({ 
                message: "No user found" 
            });
        }
        return res.status(200).json({ user: user });
        }
    
    catch (err) {
        res.json("error occured " + err)
        console.log(err)
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                account: { select: { balance: true } },
            },
        });
        if (!user) return res.status(404).json({ message: "Account not found." });
        return res.json({ user: { ...user, balance: user.account?.balance ?? 0 } });
    } catch (err) {
        console.error("Error loading account:", err);
        return res.status(500).json({ message: "Could not load your account." });
    }
};

export const searchUsers = async (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    try {
        const users = await prisma.user.findMany({
            where: {
                id: { not: req.userId },
                ...(query ? {
                    OR: [
                        { firstName: { contains: query, mode: "insensitive" } },
                        { lastName: { contains: query, mode: "insensitive" } },
                        { username: { contains: query, mode: "insensitive" } },
                    ],
                } : {}),
            },
            select: { id: true, username: true, firstName: true, lastName: true },
            orderBy: { firstName: "asc" },
            take: 100,
        });
        return res.json({ users });
    } catch (err) {
        console.error("Error searching users:", err);
        return res.status(500).json({ message: "Could not load users." });
    }
};
