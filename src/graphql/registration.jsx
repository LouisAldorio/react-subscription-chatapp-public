import {gql} from '@apollo/client'

const REGISTER = gql`
    mutation register (
        $name: String!
        $avatar: String
        $email: String!
        $password: String!
    ){
        subscriber{
            register(input: {
                name: $name
                avatar: $avatar
                email: $email
                password: $password
            })
        }
    }
`

const LOGIN = gql`
    mutation login(
        $email: String!
        $password: String!
    ) {
        subscriber{
            login(email: $email, password: $password) 
        }
    }
`

export {
    REGISTER,
    LOGIN
}