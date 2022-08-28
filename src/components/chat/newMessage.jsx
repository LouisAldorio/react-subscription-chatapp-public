import { Grid,Fab, TextField,makeStyles } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import React,{useState} from 'react'
import Divider from '@material-ui/core/Divider';
import { useMutation } from '@apollo/client';
import useForm from '../../customHooks/useForm';
import { CREATE_MESSAGE } from '../../graphql/chat';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRoomContext } from '../../reducer/chatRoomReducer';

const useStyles = makeStyles({
    root: {
        position: 'fixed',
        bottom: 0,
        padding: '25px',
        width: '100%',
        backgroundColor: 'white',
        height: 100,
        right: 0,
    },
    divider: {
        marginBottom: 10
    }
})

function NewMessage(props) {

    const classes = useStyles()
    const [state,] = useRoomContext()
    const [isSending, setIsSending] = useState(false)

    const { onChange, onSubmit, values } = useForm(Send, {
        content: ''
    })
  
    const [SendMessage, { loading }] = useMutation(CREATE_MESSAGE, {
        update(cache, result) {
            values.content = '' 
            setIsSending(false)      
        },
        variables: {
            content: values.content,
            room_id: state.currentRoom.id
        }
    })

    function Send() {
        setIsSending(true)
        SendMessage()
    }

    return (
        <div className={classes.root}>
            <form onSubmit={onSubmit}>
                <Divider className={classes.divider}/>
                <Grid container >
                    
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email" 
                            label="Type Something" 
                            value={values.content} 
                            autoComplete="off"
                            onClick={() => {
                                props.drawerHandler(false)
                            }}
                            onChange={onChange} fullWidth color="secondary" name="content"/>
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="secondary" aria-label="add" type="submit" disabled={isSending}>
                            {loading ? (<CircularProgress color="secondary" />) : <SendIcon />}
                        </Fab>
                    </Grid>
                </Grid>
            </form>          
        </div>       
    )
}

export default NewMessage

