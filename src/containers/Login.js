import React, { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";
import { Form, FormGroup, FormControl } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";




export default function Login() {

  const history = useHistory();

  const { userHasAuthenticated } = useAppContext();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <FormGroup controlId="email" >
          <Form.Label>Email</Form.Label>
          <FormControl
            size="lg"
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" >
          <Form.Label>Password</Form.Label>
          <FormControl
            size="lg"
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton block  isLoading={isLoading} disabled={!validateForm()} type="submit">
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
