import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';

const useStyles = makeStyles((theme) => ({
    avatarSmall: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}))

export default function SubscriberCard(props) {

    const classes = useStyles()
  
    return (
        <ListItem button onClick={props.onClick} key={props.index}>
            <ListItemIcon>
                <Avatar src={props.item.avatar} className={classes.avatarSmall}  alt={props.item.name}/>
            </ListItemIcon>
            <ListItemText primary={props.item.name} />
            <IconButton onClick={() => {
                props.inviteDialogHandler(true)
                props.setReceiverId(props.item.id)
            }}>
                <ChatIcon />
            </IconButton>      
        </ListItem>
    )
}