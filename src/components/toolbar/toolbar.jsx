import React, { useContext } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import './toolbar.css'
import { AuthContext } from '../../auth/auth';
import { useRoomContext } from '../../reducer/chatRoomReducer';
import { DrawerTogglerContext } from '../../App';

const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
      width: 30,
      height: 40,
      marginLeft:1,
    },
    toolbar: {
        backgroundColor: "#FFD300",
    },
    loginButton: {
      marginLeft: 'auto',
      display: 'flex'
    }
  }));

function MyToolbar(props){
    const classes = useStyles()

    const {user} = useContext(AuthContext)
    const [state,] = useRoomContext()

    const {DrawerState,toggleDrawer} = useContext(DrawerTogglerContext)

    if(!user) {
        return null
    }

    return(
        <AppBar
            position="fixed"
            className={clsx(classes.appBar)}
        >
        <Toolbar className={'toolbar'}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
                // props.drawerHandler(!props.drawerState)
                toggleDrawer(!DrawerState)()
            }}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            <div id="nav-icon2" className={clsx({
              ['open']: props.drawerState,
            })}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </IconButton>
          <Typography variant="h5" noWrap>
            {state.currentRoom.name}
          </Typography>       
        </Toolbar>
        
      </AppBar>
    )
}

export default MyToolbar;