import userModel from "../models/userModel.js"

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name) {
        next('Name is required')
    }
    if (!email) {
        next('Email is required')
    }
    if (!password) {
        next('password is required and greater than 6 characters')
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
        next('Already registered, Please login')
    }
    const user = await userModel.create({ name, email, password })
    const token = user.createJWT()
    res.status(201).send({
        success: true, message: 'User created successfully',
        user: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            location: user.location
        },
        token
    })
}

export const loginController = async (req, res, next) => {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
        next('Please provide all fields')
    }
    // Find User by Email
    const user = await userModel.findOne({ email })
    if (!user) {
        next('Invalid Username or Password')
    }
    // Compare password
    const isMatch = await user.comparepassword(password)
    if (!isMatch) {
        next('Invalid Username or Password')
    }
    const token = user.createJWT()
    res.status(201).send({
        success: true, message: 'User Login successfully',
        user: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            location: user.location
        },
        token
    })
}
