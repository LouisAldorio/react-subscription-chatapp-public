import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Holder from './page/root';
import Chip from '@material-ui/core/Chip';
import { useState } from 'react';
import CreateRoomDialog from './dialog/createRoomDialog';

var drawerWidth = window.innerWidth <= 600 ? '100%' : 450;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "normal",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: 400,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: 400,
    }),
    overflowX: 'hidden',
    width: 0,
  },
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  functionality: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    margin: 15
  },
}));

function SideBar(props) {
  const classes = useStyles();

  const [createRoomDialog,setCreateRoomDialog] = useState(false)

  return (
    <React.Fragment>
      <CssBaseline />
      
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: props.open,
            [classes.drawerClose]: !props.open,
          }),
        }}
      >
        <div className={classes.toolbar}></div>
        <div className={classes.functionality}>

          <Chip
            label={"Create Room"}
            variant="outlined"
            clickable
            onClick={() => {
              setCreateRoomDialog(true)
            }}
            color="secondary"
          />
        </div>     
        <Holder drawerHandler={props.drawerHandler}/>
        <CreateRoomDialog open={createRoomDialog} handleClose={() => {
          setCreateRoomDialog(false)
        }}/>
        
      </Drawer>  
    </React.Fragment>
  );
}

export default  SideBar;