import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import { CircularProgress } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { GET_CURRENT_SUBSCRIBER_ROOM } from '../../../graphql/room';
import { useMutation } from '@apollo/client';
import { ACCEPT_INVITATION, RECEIVED_PENDING_INVITATION } from '../../../graphql/invitation';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { useRoomContext } from '../../../reducer/chatRoomReducer';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      marginBottom: 15
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
}));

export default function InvitationRequestCard(props) {

	const history = useHistory()
	const [,dispatch] = useRoomContext()

	const { enqueueSnackbar } = useSnackbar()
	const CallSnack = (variant,message) => () => {
		enqueueSnackbar(message, { variant });
	};

	const invitation = props.sent_invitation

	const classes = useStyles();

	const [AcceptInvite, { loading }] = useMutation(ACCEPT_INVITATION, {
		async update() {
			await CallSnack('success', "Successful join to room!")()
			await history.replace(`/home/room/${invitation.room.id}`)
			await dispatch({
				type: "SET_CURRENT_ROOM",
				payload: {
				  id: invitation.room.id,
				  name: invitation.room.name
				}
			})

			props.drawerHandler(false)
		},
        onError(err) {
            if(err) {
                CallSnack('warning',err.graphQLErrors[0].message)()
            }
        },
        variables: {
            room_id: invitation.room.id,
            invitation_id: invitation.id
        },
        refetchQueries: [
            {
                query: GET_CURRENT_SUBSCRIBER_ROOM
            }, {
				query: RECEIVED_PENDING_INVITATION
			}
        ]
    })

      const handleAcceptInvitation = () => {
        AcceptInvite()
      }

	return (
		<Card className={classes.root} elevation={3}>
			<CardHeader
				avatar={
					<Avatar aria-label="recipe" className={classes.avatar} src={invitation.inviter.avatar} />
				}
				action={loading ? (<CircularProgress color="secondary"/>) :
					<IconButton aria-label="settings" style={{ color: green[500] }} onClick={handleAcceptInvitation}>
						<Done />
					</IconButton>
				}
				title={<div dangerouslySetInnerHTML={{__html: `${invitation.inviter.name.bold()} has invited you to join room ${invitation.room.name.bold()}`}}></div>}
			//   subheader="September 14, 2016"
			/>
		</Card>
	);
}