import {gql} from '@apollo/client'

const INVITE_USER = gql`
    mutation InviteUserToRoom (
        $room_id: Int!
        $receiver_id: Int!
    ){
        invitation{
            invite(room_id: $room_id, receiver_id: $receiver_id) {
                id
                inviter_id
                receiver_id
                room_id
                inviter{
                    id
                    name
                    avatar
                }
                receiver{
                    id
                    name
                    avatar
                }
                room{
                    id
                    name
                    avatar
                    subscribers{
                        id
                        name
                        avatar
                    }
                }
            }
        }
    }
`

const ACCEPT_INVITATION = gql`
    mutation AcceptPendingInvitation (
        $invitation_id: Int!
        $room_id: Int!
    ) {
        invitation{
            accept_invitation(invitation_id: $invitation_id, room_id: $room_id)
        }
    }
`

const RECEIVED_PENDING_INVITATION = gql`
    query GetReceivedPendingInvitation {
        invitation {
            received_invitation_request {
                id
                inviter_id
                receiver_id
                room_id
                inviter {
                    id
                    name
                    avatar
                }
                receiver {
                    id
                    name
                    avatar
                }
                room {
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
    }
`

const SENT_PENDING_INVITATION = gql`
    query GetSentPendingInvitation {
        invitation {
            sent_invitation_request {
                id
                inviter_id
                receiver_id
                room_id
                inviter {
                    id
                    name
                    avatar
                }
                receiver {
                    id
                    name
                    avatar
                }
                room {
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
    }
`

export {
    INVITE_USER,
    ACCEPT_INVITATION,
    SENT_PENDING_INVITATION,
    RECEIVED_PENDING_INVITATION
}