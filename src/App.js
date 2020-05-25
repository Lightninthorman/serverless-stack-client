import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import './App.css';
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";

function App() {

    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
              alert(e);
            }
        }

        setIsAuthenticating(false);
    }

    function handleLogout() {
        userHasAuthenticated(false);
    }

    return (

        !isAuthenticating &&
        <Container>


            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand >
                    <Link to="/">Scratch</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {isAuthenticated
                            ? <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                            : <>
                                <Nav.Item >

                                    <Nav.Link  as={Link} to="/signup">Signup</Nav.Link>

                                </Nav.Item>
                                <Nav.Item >

                                    <Nav.Link  as={Link} to="/login">Login</Nav.Link>

                                </Nav.Item>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
            </AppContext.Provider>

        </Container>
    );
}

export default App;
