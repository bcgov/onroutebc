import React from "react";
import { Table } from "react-bootstrap";

export const List = () => {
  return (
    <div className="my-3">
      <Table variant="dark" striped bordered hover>
        <thead>
          <tr>
            <th>VIN</th>
            <th>Company</th>
            <th>Vehicle Type</th>
            <th>Other</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>3</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
