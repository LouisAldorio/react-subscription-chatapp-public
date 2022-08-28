import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {NavLink} from 'react-router-dom'
import Copyright from '../../footer/footer';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { AuthContext } from '../../../auth/auth';
import { REGISTER } from '../../../graphql/registration';
import {useMutation} from '@apollo/client'
import { useHistory } from 'react-router-dom';
import  useForm  from '../../../customHooks/useForm';
import { requestFirebaseNotificationPermission } from '../../../firebasenotif/firebaseInit';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
    const classes = useStyles();

    const context = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar()
    const failRegister = (variant,message) => () => {
        enqueueSnackbar(message, { variant });
    };

    let history = useHistory()

    const { onChange, onSubmit, values } = useForm(Register, {
        name:'',
        avatar: 'https://i0.wp.com/itpoin.com/wp-content/uploads/2014/06/guest.png',
        email: '',
        password: ''
    })

    const [RegisterUser, { loading }] = useMutation(REGISTER, {
        update(cache, result) {
            context.login(result.data.subscriber.register)
            history.push('/home') 
            requestFirebaseNotificationPermission()
                .then((firebaseToken) => {
                    // eslint-disable-next-line no-console
                    console.log(firebaseToken);
                })
                .catch((err) => {
                    console.log(err)
                    return err;
                });         
        },
        onError(err) {
            if(err) {
                failRegister('warning',err.graphQLErrors[0].message)()
            }
        },
        variables: values
    })
    

    function Register() {
        RegisterUser()
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="name"
                            onChange={onChange}
                            label="Full Name"
                            name="name"
                            autoComplete="lname"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            onChange={onChange}
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            onChange={onChange}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Sign Up
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                    <NavLink to="/login" variant="body2">
                        Already have an account? Sign in
                    </NavLink>
                    </Grid>
                </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}