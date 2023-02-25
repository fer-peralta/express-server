import express from "express"
import { UserGraphqlController } from "../../controllers/user.controller.graphql.js"

const router = express.Router()

router.get('/', UserGraphqlController())
router.post('/', UserGraphqlController())

export { router as GraphqlRouter }