import React, { FormEvent } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import "./VehicleForm.scss";

export const VehicleForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    window.alert("Vehicle Submitted!");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row className="vehicle-form">
          <Col>
            <Form.Group controlId="unit">
              <Form.Label>Unit #</Form.Label>
              <Form.Control required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="plate">
              <Form.Label>Plate</Form.Label>
              <Form.Control required />
            </Form.Group>
          </Col>
        </Row>
      </Stack>
    </Form>
  );
};
