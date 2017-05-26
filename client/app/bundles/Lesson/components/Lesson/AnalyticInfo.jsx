import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AnalyticInfo extends Component {
  render() {
    return (
      <div>
        <h2>Understanding your results</h2>
        <Table className="striped bordered condensed hover">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
        </Table>
      </div>
    )
  }
}
