import { useQuery, useSubscription } from '@apollo/client';
import React,{useState} from 'react'
import { useEffect } from 'react';
import {GET_MESSAGES, SUBSCRIBE} from '../../graphql/chat';
import { useRoomContext } from '../../reducer/chatRoomReducer';
import { useLazyQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewMessage from './newMessage';
import { makeStyles } from '@material-ui/core';
import ChatHolder from './holder';
import { useRef } from 'react';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: '100%',
      height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
      height: '70vh',
      overflowY: 'auto'
    },
    root: {
        marginBottom: 100,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    progressBar: {
        margin: '0 auto'
    }
  });

function ChatRoom(props) {
    
    const classes = useStyles()

    const [state,] = useRoomContext()
    const [page, setPage] = useState(1)
    const [allChat, setAllChat] = useState([])

    const bottom = useRef()
    const firstRender = useRef(true);

    const [getMessages, {
        loading: messageLoading, 
        data: messageData
    }] = useLazyQuery(GET_MESSAGES,{
        variables: {
            page: page,
            limit: 20,
            room_id: state.currentRoom.id
        },
        onCompleted: async (data) => {
            await setAllChat([
                ...data.message.messages.nodes, ...allChat
            ])

            if (firstRender.current) {
                firstRender.current = false;
                await scrollToBottom()
                return;
            }  
            await window.scrollTo({
                top: 300,
                behavior: 'smooth',
            });
        },
        onError: (err) => {
            if(err) {
                console.log(err)
            }
        },
    })

    const scrollToBottom = () => {
        bottom.current.scrollIntoView({ behavior: "smooth" }); 
    }

    useEffect(async () => {     
        getMessages()  
    },[page])

    useEffect(() => {
        getMessages()   

       //clear chat and reset everything 
       setAllChat([])
       setPage(1)
       firstRender.current = true
    },[state.currentRoom.id])

    window.onscroll = function() {
        if(window.pageYOffset === 0) {
            if(messageData && messageData.message.messages.total > allChat.length) {
                setPage(page + 1)
            }          
        }      
    };

    useSubscription(SUBSCRIBE,{ 
        variables: { 
            room_id: state.currentRoom.id
        },
        onSubscriptionData: (data) => {
            if(data.subscriptionData.data.messages.length > 0) {
                setAllChat([
                    ...allChat, data.subscriptionData.data.messages[data.subscriptionData.data.messages.length - 1]
                ])
                scrollToBottom()
            } 
        },    
    });
    
    return (
        <div className={classes.root} >         
            <React.Fragment>
                <h1>{!state.currentRoom.id && "Let's Start New Chat"}</h1>
                {
                    messageLoading && <CircularProgress color="secondary" className={classes.progressBar}/>
                }            
                {
                    allChat && allChat.map((message, index) => (
                        <ChatHolder 
                            index={index}
                            content={message.content}  
                            timestamp={message.created_at} 
                            subscriber={message.subscriber}/>
                    ))
                }      
                <div ref={bottom} ></div> 
                {state.currentRoom.id && (<NewMessage roomId={state.currentRoom.id} drawerHandler={props.drawerHandler}/>)}
            </React.Fragment>                     
        </div>
    )
}

export default ChatRoom;