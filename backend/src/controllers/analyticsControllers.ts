import SalesRecord from "../models/SalesRecord.js"
import Order from "../models/Order.js"
import type {Request,Response} from "express"



export const getSalesSummary = async(req:Request, res:Response) =>{
  try {
    const salesSummary = await Order.aggregate([
      {
        $match:{
          isPaid:true,
        },
      },
      {
        $group:{
          _id:null,
          totalSales:{
            $sum:{$sum: '$items.quantity'}
          },
          totalRevenue:{
            $sum:'$totalPrice'
          },
        },
      },
    ]);
    if (salesSummary.length === 0) {
      res.status(404).json({message:"No Records Found"})
    }
    res.status(200).json(salesSummary)
  } catch (error) {
    res.status(500).json({message:"Server Error"})
  }
}

export const getOrdersByDate = async(req:Request, res:Response) => {
  try {
    const ordersByDate = await Order.aggregate([
      {$match:{isPaid:true},},
      {
        $group:{
          _id:{$dateToString: {format :"%Y-%m-%d", date:"$createdAt"}}, //converts to string
          count:{$sum:1}, // increases count by 1
        },
      },
      {$sort:{_id:1}}, //ascending ordersByDate
    ]);
    res.status(200).json(ordersByDate)
    
    
  } catch (error) {
    res.status(500).json({message:"Server Error"})
    
  }
}

export const getTopSellingProducts = async(req:Request,res:Response) =>{
  try {
    const topSellingProducts = await Order.aggregate([
      {
        $match:{isPaid:true,isDelivered:true}
      },
      {$unwind:'$items'},
      {
        $group:{
          _id:'$items.product',
          title:{$first:'items.title'},
          totalQuantity:{$sum:'items.quantity'},
        }
      },
      {$sort:{totalQuantity:-1}},
      {$limit:10},
    ])
    if (topSellingProducts.length===0) {
      return res.status(404).json({message:"NO DATA FOUND"})
      
    }res.status(200).json(topSellingProducts)
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server Error"})
    
  }
}

export const getMonthlyRevenue = async(req:Request, res:Response) =>{
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $match:{isPaid:true}
      },
      {
        $group:{
          _id:{$dateToString:{format:"%Y-%m",date:"$createdAt"}},
          totalRevenue:{$sum:'$totalPrice'},
        }
      },{
        $sort:{_id:1}
      }
    ])
    if (monthlyRevenue.length===0) {
      return res.status(404).json({message:"Record Not Found For monthlyRevenue"})
    }
    res.status(200).json(monthlyRevenue)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Server Error"})
  }
}
