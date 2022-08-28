import React from 'react'
import { CircularProgress, makeStyles } from '@material-ui/core';
import InvitationRequestCard from '../components/InvitationRequestCard';
import { useQuery } from '@apollo/client';
import { RECEIVED_PENDING_INVITATION } from '../../../graphql/invitation';
import { Paper, List } from '@material-ui/core';

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

export default function Request(props) {

    const classes = useStyles()

    const {loading,data} = useQuery(RECEIVED_PENDING_INVITATION)

    return (
        <React.Fragment>
        <p>&nbsp; Invitation's Request</p>
            {loading ? (
              <CircularProgress color="secondary"/>
            ) : 
                data.invitation.received_invitation_request.length > 0 && (
                    <List className={classes.list}>
                        {
                            data.invitation.received_invitation_request.map((item,index) => (
                                <InvitationRequestCard sent_invitation={item} drawerHandler={props.drawerHandler}/>
                            ))
                        }           
                    </List>
                )
            }  
      </React.Fragment>
    )
}