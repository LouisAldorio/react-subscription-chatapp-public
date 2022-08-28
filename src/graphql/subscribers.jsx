import {gql} from '@apollo/client'

const GET_ONLINE_SUBSCRIBERS = gql`
    query GetOnlineSubscribers(
        $query: String!
    ) {
        subscriber{
            subscribers(query: $query){
                id
                name
                avatar
                is_online
            }
        }
    }
`

export {
    GET_ONLINE_SUBSCRIBERS
}