import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import './App.css';
import Routes from "./Routes";

function App() {
  return (
    <Router>
        <Container>
            <Navbar fluid collapseOnSelect expand="lg" bg="light" variant="light">
              <Navbar.Brand>
                <Link to="/">Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item>

                            <Nav.Link tag={Link} to="/signup">Signup</Nav.Link>

                    </Nav.Item>
                    <Nav.Item>

                            <Nav.Link tag={Link} to="/login">Login</Nav.Link>

                    </Nav.Item>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
        </Container>
        <Routes />
    </Router>
  );
}

export default App;
