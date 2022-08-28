import React,{useContext} from 'react'
import SideBar from '../components/sidebar/sidebar'
import Main from '../main/main'
import {Redirect} from 'react-router-dom'
import { AuthContext } from '../auth/auth'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	toolbar: {
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }, 
}))

export default function Middleware(props) {

    const classes = useStyles()

    const {user} = useContext(AuthContext)
    if(!user) {
        return (
            <Redirect to="/login" />
        )
    }

    

    return (
        <React.Fragment>
            <div className={classes.toolbar} />
            <div style={{display: window.innerWidth > 600 && 'flex'}}>
                <SideBar open={props.drawerState} drawerHandler={props.drawerHandler}/> 
                 <Main drawerHandler={props.drawerHandler}/>           
            </div>
        </React.Fragment>
        
    )
}