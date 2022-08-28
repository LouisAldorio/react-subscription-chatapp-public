import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../auth/auth'
import { makeStyles} from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    container: {
      bottom: 0
      // position: "fixed" // remove this so we can apply flex design
    },
    bubbleContainer: {
      width: "100%",
      display: "flex" //new added flex so we can put div at left and right side
      //check style.css for left and right classnaeme based on your data
    },
    bubble: {
      border: "0.5px solid black",
      borderRadius: "10px",
      margin: "5px",
      padding: "10px",
      display: "inline-block"
    },
    right: {
        justifyContent: 'flex-end !important'
    },
    left: {
        justifyContent: 'flex-start !important'
    }
  }));

function ChatHolder(props) {
    const classes = useStyles()
    const {user} = useContext(AuthContext)

    return (
        <div className={`${classes.bubbleContainer} ${props.subscriber.id == user.SubscriberID ? classes.right : classes.left}`} key={props.index}>
            {
                props.subscriber.id != user.SubscriberID && (
                    <Avatar alt="Remy Sharp" src={props.subscriber.avatar} />
                )
            }
            <div key={props.index} className={classes.bubble}>
                <div >
                    {props.subscriber.name}
                    <h5>
                        {props.content}
                        <p>{props.timestamp}</p>
                    </h5>
                </div>
            </div>

            {
                props.subscriber.id == user.SubscriberID && (
                    <Avatar alt="Remy Sharp" src={props.subscriber.avatar}/>
                )
            }
        </div>
    )
}

export default ChatHolder