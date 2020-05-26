import React, {useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import { Navbar, Nav, Container } from "react-bootstrap";
import './App.css';
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";



function App() {

    const history = useHistory();

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
              onError(e);
            }
        }

        setIsAuthenticating(false);
    }

    async function handleLogout() {
      await Auth.signOut();

      userHasAuthenticated(false);
      history.push("/login");
    }

    return (

        !isAuthenticating &&
        <Container>


            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand >
                    <Link to="/" className="h4">Scratch</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {isAuthenticated
                            ? <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                            : <>
                                <Nav.Item >

                                    <Nav.Link  eventKey="1" as={Link} to="/signup">Signup</Nav.Link>

                                </Nav.Item>
                                <Nav.Item >

                                    <Nav.Link  eventKey="2" as={Link} to="/login">Login</Nav.Link>

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
