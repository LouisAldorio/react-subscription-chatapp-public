import React from 'react'
import { makeStyles } from '@material-ui/core';
import { Container } from 'react-bootstrap'
import ChatRoom from '../components/chat/chat';
import './main.css'

const useStyles = makeStyles((theme) => ({
	toolbar: {
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }, 
}))

function Main(props) {

    const classes = useStyles()

    return (
        <main className={'main'}>
            <div className={classes.toolbar} />
            <Container className="container">
                <div className="page">
                    <ChatRoom drawerHandler={props.drawerHandler}/>
                </div>
            </Container>
          </main>
    )
}

export default Main;