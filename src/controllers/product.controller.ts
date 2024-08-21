import { Request, Response } from 'express'
import { productValidation } from '../validations/product.validation'
import { prisma } from '../config/prisma'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        // categories: true // join table dan mengambil isi value dari table categories
        categories: {
          select: {
            title: true // Hanya mengambil title dari category
          }
        }
      }
    })
    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Success get all products',
      data: products
    })
  } catch (error) {
    return res.status(200).send({
      success: false,
      statusCode: 500,
      message: "Can't get all products",
      data: null
    })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { error, value } = productValidation(req.body)
    if (error) {
      return res.status(422).send({
        success: false,
        statusCode: 422,
        message: error.details[0].message,
        data: null
      })
    }
    const product = await prisma.products.create({
      data: value
    })
    return res.status(201).send({
      success: true,
      statusCode: 201,
      message: 'Success create product',
      data: product
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      statusCode: 500,
      message: "Can't create product",
      data: null
    })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.products.delete({
      where: {
        id: Number(id)
      }
    })
    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Success delete product',
      data: null
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      statusCode: 500,
      message: "Can't delete product",
      data: null
    })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { error, value } = productValidation(req.body)
    if (error) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        message: error.details[0].message,
        data: null
      })
    }
    const product = await prisma.products.update({
      where: {
        id: Number(id)
      },
      data: value
    })
    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Success update product',
      data: product
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      statusCode: 500,
      message: "Can't update product",
      data: null
    })
  }
}
