import React,{useState, useEffect} from 'react'
import { Paper } from '@material-ui/core';
import SkeletonSubscriberCard from '../components/skeletonCard';
import SubscriberCard from '../components/subscriberCard';
import List from '@material-ui/core/List';
import RoomCard from '../components/roomCard';
import { GET_ONLINE_SUBSCRIBERS } from '../../../graphql/subscribers';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_SUBSCRIBER_ROOM } from '../../../graphql/room';
import { useRoomContext } from '../../../reducer/chatRoomReducer';
import { useContext } from 'react';
import {AuthContext} from '../../../auth/auth'
import {makeStyles} from '@material-ui/core'
import InviteDialog from '../dialog/inviteDialog';
import { useHistory, useParams } from 'react-router-dom';


let skeleton = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]

const useStyles = makeStyles((theme) => ({
  list: {
    marginTop: 10,
    position: "relative",
    display: "block",
  },
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function Home(props) {

  const classes = useStyles()

  const {user} = useContext(AuthContext)
  const history = useHistory()
  const { room_id } = useParams()

  const [inviteDialog, setInviteDialog] = useState(false)
  const [receiverId, setReceiverId] = useState(0)
  const [,dispatch] = useRoomContext()
  const ChangeRoom = async (event, room) => {

    if(room.id != room_id) {
      await history.replace(`/home/room/${room.id}`)
      await dispatch({
        type: "SET_CURRENT_ROOM",
        payload: {
          id: room.id,
          name: room.name
        }
      })
    }

    await props.drawerHandler(false)
  }

  const {loading : room_loading,data : room_data} = useQuery(GET_CURRENT_SUBSCRIBER_ROOM)
  const {loading : subscriber_loading, data : subscriber_data} = useQuery(GET_ONLINE_SUBSCRIBERS,{
    variables: {
      query: ''
    }
  })

  useEffect(async () => {
    if(room_id) {

      let currentUserRoomIds = []
      const roomName = new Map();
      if(room_data) {
        room_data.room.rooms_by_logged_in_user.forEach(async (room) => {
          await currentUserRoomIds.push(room.id)
          await roomName.set(String(room.id), room.name)
        })

        if(!currentUserRoomIds.includes(parseInt(room_id))) {
          await history.replace(`/home`)
          await dispatch({
            type: "SET_CURRENT_ROOM",
            payload: {
              id: '',
              name: 'whosapp'
            }
          })
        }else {
          await dispatch({
            type: "SET_CURRENT_ROOM",
            payload: {
              id: room_id,
              name: roomName.get(room_id)
            }
          })
        }
      }
    }
  }, [room_data])

    return (
      <React.Fragment>
        <p>&nbsp; Rooms</p>
        <Paper style={{maxHeight: 450, overflow: 'auto', width: '90%', margin: '0 auto'}}>
          
          <List className={classes.list}>
            {room_loading ? (
              skeleton.map((item,index) => (            
                <SkeletonSubscriberCard index={index} item={item}/>         
              ))
            ) : (
              room_data.room.rooms_by_logged_in_user.map((item,index) => (
                <RoomCard key={index} item={item} index={index} onClick={(e) => {
                  ChangeRoom(e,item)
                }}/>
              ))
            )}
          </List>
        </Paper>

        <p>&nbsp; Global Users</p>
        <Paper style={{maxHeight: 450, overflow: 'auto' , width: '90%', margin: '0 auto'}}>         
          <List className={classes.list}>
            {subscriber_loading ? (
              skeleton.map((item,index) => (            
                <SkeletonSubscriberCard index={index}/>         
              ))
            ) : (
              subscriber_data.subscriber.subscribers.map((item,index) => {
                return item.id != user.SubscriberID && <SubscriberCard item={item} index={index} 
                  inviteDialogHandler={setInviteDialog} 
                  setReceiverId={setReceiverId}/>
              })
            )}
          </List>
        </Paper>

        <InviteDialog receiverId={receiverId} open={inviteDialog} handleClose={() => {
            setInviteDialog(false)
        }}/>
      </React.Fragment>
    )
}