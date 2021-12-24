import React from 'react';
import {Form, Row, Col, Button } from 'react-bootstrap';

class MethanolConcInput extends React.Component {
  render() {
    return (
      <Form onSubmit={this.props.onSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            [MeOH]
          </Form.Label>
          <Col sm={10}>
            {
              // Allow only number inputs
            }
            <Form.Control type="input" placeholder="Concentration of Methanol" />
          </Col>
        </Form.Group>
        {
          // Get submit to work!
        }
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

/*
<Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
    <Form.Label column sm={2}>
      Email
    </Form.Label>
    <Col sm={10}>
      <Form.Control type="email" placeholder="Email" />
    </Col>
  </Form.Group>
*/

export default MethanolConcInput;