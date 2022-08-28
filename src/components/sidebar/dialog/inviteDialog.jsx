import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import useForm from '../../../customHooks/useForm';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { INVITE_USER, SENT_PENDING_INVITATION } from '../../../graphql/invitation';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { GET_CURRENT_SUBSCRIBER_ROOM } from '../../../graphql/room';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function InviteDialog(props) {
    const { enqueueSnackbar } = useSnackbar()
    const callSnackBar = (variant,message) => () => {
        enqueueSnackbar(message, { variant });
    };

    const {onSubmit, onChange, values} = useForm(Invite,{
        room_id: ''
    })

    const [InviteUser, { loading }] = useMutation(INVITE_USER, {
        update: (proxy, result) => {
            callSnackBar('success', "User Invited!")()
            props.handleClose()

            const CurrentData = proxy.readQuery({query: SENT_PENDING_INVITATION})
            proxy.writeQuery({
                query: SENT_PENDING_INVITATION,
                data:{
                    invitation:{
                        sent_invitation_request: [
                            ...CurrentData.invitation.sent_invitation_request,
                            result.data.invitation.invite
                        ]
                    }
                }
            })
        },
        onError: (err) => {
            if(err) {
                callSnackBar('warning', err.graphQLErrors[0].message)()
            }
        },
        variables: {
            room_id: values.room_id,
            receiver_id: props.receiverId
        }
    })

    const {loading : currentUserRoomLoading, data} = useQuery(GET_CURRENT_SUBSCRIBER_ROOM, {
        onError: (err) => {
            if(err) {
                callSnackBar('warning', err.graphQLErrors[0].message)()
            }
        }
    })

    const {loading : PendingInvitationLoading, data : pendingInvitation} = useQuery(SENT_PENDING_INVITATION)

    function Invite() {
        InviteUser()
    }

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <form onSubmit={onSubmit}>
                <DialogTitle>{"Invite User To Room"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please Select A Room to proceed.
                    </DialogContentText>
                    <FormControl className={classes.formControl}>
                        {
                            currentUserRoomLoading || PendingInvitationLoading ? (<CircularProgress color="secondary" style={{marginLeft: '47%'}}/>) : (
                                <React.Fragment>
                                    <InputLabel color={"secondary"}>Rooms</InputLabel>
                                    <Select
                                        name="room_id"
                                        value={values.room_id}
                                        color={"secondary"}
                                        onChange={onChange}
                                    >
                                        {
                                            data && data.room.rooms_by_logged_in_user.map((room, index) => {
                                                let subscriberIds = []
                                                room.subscribers.forEach((subscriber) => {
                                                    subscriberIds.push(subscriber.id)
                                                })

                                                let pendingInvitationSubscriberIds = []
                                                let roomIds = []
                                                pendingInvitation && pendingInvitation.invitation.sent_invitation_request.forEach((invitation) => {
                                                    pendingInvitationSubscriberIds.push(invitation.receiver_id)
                                                    roomIds.push(invitation.room_id)
                                                })

                                                if(!subscriberIds.includes(props.receiverId)) {

                                                    if(pendingInvitationSubscriberIds.length > 0 && roomIds.length > 0){
                                                        if(pendingInvitationSubscriberIds.includes(props.receiverId) 
                                                        && !roomIds.includes(room.id)) {
                                                            return (
                                                                <MenuItem value={room.id}>{room.name}</MenuItem>
                                                            )
                                                        }
                                                    }else {
                                                        return (
                                                            <MenuItem value={room.id}>{room.name}</MenuItem>
                                                        )   
                                                    }                                         
                                                }
                                            })
                                        }
                                        
                                    </Select>
                                </React.Fragment>
                            )
                        }
                    </FormControl>
                </DialogContent>

                {loading ? (<CircularProgress color="secondary" style={{marginLeft: '47%'}}/>) : (
                    <DialogActions>
                        <Button onClick={props.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button type="submit" color="secondary" onSubmit={onSubmit}>
                            Invite
                        </Button>
                    </DialogActions>
                )}                  
            </form> 
        </Dialog>
    )
}