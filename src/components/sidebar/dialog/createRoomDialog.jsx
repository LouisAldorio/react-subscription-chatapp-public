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
import { useMutation } from '@apollo/client';
import { CREATE_ROOM, GET_CURRENT_SUBSCRIBER_ROOM } from '../../../graphql/room';
import { CircularProgress } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function CreateRoomDialog(props) {

    const { enqueueSnackbar } = useSnackbar()
    const failRegister = (variant,message) => () => {
        enqueueSnackbar(message, { variant });
    };

    const {onSubmit, onChange, values} = useForm(Create,{
        name: ''
    })

    const [CreateRoom, { loading }] = useMutation(CREATE_ROOM, {
        update(cache, result) {
            props.handleClose() 
            values.name = ''     
        },
        onError(err) {
            if(err) {
                failRegister('warning',err.graphQLErrors[0].message)()
                values.name = '' 
            }
        },
        variables: {
            name: values.name
        },
        refetchQueries: [
            {
                query: GET_CURRENT_SUBSCRIBER_ROOM
            }
        ]
    })

    function Create() {
        CreateRoom()
    }

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
        >          
            <form onSubmit={onSubmit}>
                <DialogTitle>{"Create New Room"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please Type A Room Name to proceed.
                    </DialogContentText>
                    <TextField
                        onChange={onChange}
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        color="secondary"
                        name="name"
                        variant="outlined"
                        fullWidth
                        value={values.name}
                        disabled={loading}
                    />
                </DialogContent>

                {loading ? (<CircularProgress color="secondary" style={{marginLeft: '47%'}}/>) : (
                    <DialogActions>
                        <Button onClick={props.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button type="submit" color="secondary">
                            Create
                        </Button>
                    </DialogActions>
                )}                  
            </form>                    
        </Dialog>
    )
}