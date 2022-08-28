import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';

export default function SkeletonSubscriberCard(props) {
    return (
        <ListItem button key={props.index}>
          <ListItemIcon><Skeleton animation="wave" variant="circle" width={25} height={25} /></ListItemIcon>
          <ListItemText primary={<Skeleton animation="wave" />} />
        </ListItem>
    )
}