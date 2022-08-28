import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';

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

export default function PendingInvitationCard(props) {

    const invitation = props.sent_invitation

	const classes = useStyles();

    return (
        <Card className={classes.root} elevation={3}>
			<CardHeader
				avatar={
					<Avatar aria-label="recipe" className={classes.avatar} src={invitation.inviter.avatar} />
				}
				action={
					<div style={{marginTop: 30}}>
                        <Avatar aria-label="recipe" className={classes.avatar} src={invitation.receiver.avatar} />
                    </div>                   
				}
				title={<div dangerouslySetInnerHTML={{__html: `You have invited ${invitation.receiver.name.bold()} to join room ${invitation.room.name.bold()}`}}></div>}
			  subheader={
                <Chip
                    style={{marginTop: 10}}
                    label={"Pending"}                  
                    clickable
                    color="secondary"
                />
              }
			/>
		</Card>
    )
}