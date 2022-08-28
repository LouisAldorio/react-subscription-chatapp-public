import {gql} from '@apollo/client'

const GET_CURRENT_SUBSCRIBER_ROOM = gql`
    query GetSubscribersRoom {
        room{
            rooms_by_logged_in_user {
                id
                name
                avatar
                subscribers{
                    id
                    name
                    avatar
                    is_online
                }
            }
        }
    }
`

const ADD_SUBSCRIBER_TO_ROOM = gql`
    mutation joinRoom(
        $room_id: Int!
    ) {
        room {
            add_new_subscriber_to_room(room_id: $room_id) {
                id
                name
                avatar
                subscribers {
                    id
                    name
                    avatar
                }
            }
        }
    }
`

const CREATE_ROOM = gql`
    mutation createRoom (
        $name: String!
    ){
        room {
            create(input: { name: $name }) {
                id
                name
                avatar
            }
        }
    }
`

export {
    GET_CURRENT_SUBSCRIBER_ROOM,
    ADD_SUBSCRIBER_TO_ROOM,
    CREATE_ROOM
}