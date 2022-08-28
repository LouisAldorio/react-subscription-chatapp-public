import React from 'react'
import { CircularProgress, makeStyles } from '@material-ui/core';
import InvitationRequestCard from '../components/InvitationRequestCard';
import { useQuery } from '@apollo/client';
import { SENT_PENDING_INVITATION } from '../../../graphql/invitation';
import { Paper, List } from '@material-ui/core';
import PendingInvitationCard from '../components/pendingInvitationCard';

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

export default function Pending() {

    const classes = useStyles()

    const {loading,data} = useQuery(SENT_PENDING_INVITATION)

    return (
        <React.Fragment>
        <p>&nbsp; Sent Invitations</p>            
            {loading ? (
              <CircularProgress color="secondary"/>
            ) : 
                data.invitation.sent_invitation_request.length > 0 && (
                    <List className={classes.list}>
                        {
                            data.invitation.sent_invitation_request.map((item,index) => (
                                <PendingInvitationCard sent_invitation={item}/>
                            ))
                        }           
                    </List>
                )
            }       
        </React.Fragment>
    )
}