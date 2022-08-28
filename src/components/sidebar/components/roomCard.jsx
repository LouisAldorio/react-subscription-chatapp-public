import React, { useContext } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { AuthContext } from '../../../auth/auth';


const useStyles = makeStyles((theme) => ({
    avatarSmall: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(8),
    },
}))

export default function RoomCard(props) {

    const {user} = useContext(AuthContext)

    const classes = useStyles()
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
  
    return (
        <React.Fragment>
            <ListItem button  key={props.index}>
                <ListItem onClick={props.onClick}>
                    <ListItemIcon>
                        <Avatar src={props.item.avatar} className={classes.avatarSmall}  alt={props.item.name}/>
                    </ListItemIcon>
                    
                    <ListItemText primary={props.item.name} />
                </ListItem>
                
                {open ? <ExpandLess button onClick={handleClick}/> : <ExpandMore button onClick={handleClick}/>}
                
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        props.item.subscribers.map((subcriber) => (
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <Avatar src={subcriber.avatar} className={classes.avatarSmall}  alt={subcriber.name}/>    
                                </ListItemIcon>
                                <ListItemText primary={subcriber.id == user.SubscriberID ? "You" : subcriber.name} />
                            </ListItem>
                        ))
                    }
               
                </List>
            </Collapse>
        </React.Fragment>
        
    )
}