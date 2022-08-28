import {gql} from '@apollo/client'

const SUBSCRIBE = gql`
    subscription subscribeToChat(
        $room_id: Int!
    ){
        messages(room_id: $room_id){
            id
            content
            created_at
            subscriber{
                id
                name
                avatar
            }
        }
    }
`

const GET_MESSAGES = gql`
    query getAllMessages(
        $page: Int!
        $limit: Int!
        $room_id: Int!
    ) {
        message{
            messages(page: $page, limit: $limit, room_id: $room_id){
                total
                nodes{
                    id
                    content
                    created_at
                    subscriber{
                        id
                        name
                        avatar
                    }
                }
            }
        }
    }
`

const CREATE_MESSAGE = gql`
    mutation sendMessage (
        $content: String!
        $room_id: Int!
    ){
        message{
            post_message(content: $content,room_id: $room_id)
        }
    }
`

export { SUBSCRIBE,GET_MESSAGES, CREATE_MESSAGE }