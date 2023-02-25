import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { root } from "../services/user.service.graphql.js";

const graphqlUserSchema = buildSchema(`
    type User{
        _id:String,
        name: String,
        username: String,
        password: String
    }

    input UserInput {
        name: String,
        username: String,
        password: String
    }

    type Query{
        getUsers:[User],
        getUserById(_id:String): User
    }

    type Mutation{
        addUser(user:UserInput): User
    }

`)

export const UserGraphqlController = () => {
    return graphqlHTTP({
        schema: graphqlUserSchema,
        rootValue: root,
        graphiql: true
    })
}