import jobsModel from "../models/jobsModel.js"
import mongoose from "mongoose"
import moment from "moment"
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        next('Please provide all fields')
    }
    req.body.createdBy = req.user.userId
    const Job = await jobsModel.create(req.body)
    res.status(201).json({
        Job
    })
}

export const getallJobsController = async (req, res, next) => {
    const { status, workType, search, sort } = req.query

    // Conditions for searching and filter

    const queryObject = {
        createdBy: req.user.userId
    }
    if (status && status != 'all') {
        queryObject.status = status
    }
    if (workType && workType != 'all') {
        queryObject.workType = workType
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }
    let queryResult = jobsModel.find(queryObject)

    // Sorting
    if (sort === 'latest') {
        queryResult = queryResult.sort('-createdAt')
    }
    if (sort === 'oldest') {
        queryResult = queryResult.sort('createdAt')
    }
    if (sort === 'a-z') {
        queryResult = queryResult.sort('position')
    }
    if (sort === 'z-a') {
        queryResult = queryResult.sort('-position')
    }

    // Pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    queryResult = queryResult.skip(skip).limit(limit)
    
    // Jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult)
    const numOfPage = Math.ceil(totalJobs / limit)
    const jobs = await queryResult

    // const jobs = await jobsModel.find({ createdBy: req.user.userId })
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage
    })
}

export const updateJobController = async (req, res, next) => {
    const { id } = req.params
    const { company, position } = req.body
    // validation
    if (!company || !position) {
        next('Please provide all fields')
    }
    //  find Job
    const job = await jobsModel.findOne({ _id: id })
    // validation
    if (!job) {
        next(`Job not found with this ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('You are not authorized to update this job')
        return
    }
    const updatejob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        updatejob
    })
}

export const deleteJobController = async (req, res, next) => {
    const { id } = req.params
    //  find Job
    const job = await jobsModel.findOne({ _id: id })
    // validation
    if (!job) {
        next(`Job not found with this ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('You are not authorized to delete this job')
        return
    }
    await job.deleteOne()
    res.status(200).json({
        message: 'Successfully Deleted'
    })
}

export const jobStatsController = async (req, res) => {
    const stats = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }

        }
    ]);
    // const defaultStats = {
    //     pending: stats.pending || 0,
    //     interview: stats.interview || 0,
    //     rejected: stats.rejected || 0,
    // }

    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }

        }
    ])
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item
        const date = moment().month(month - 1).year(year).format('MMM,Y')
        return { date, count }
    }).reverse()
    res.status(200).json({ totalJob: stats.length, stats, monthlyApplication })
}

