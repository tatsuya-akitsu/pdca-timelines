import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

import logo from '../../images/logo_horizontal.svg';

class ReportDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      actions: [],
      tasks: [],
      nextActions: [],
      logs: [],
      allRetro: ''
    }
    this.db = firebase.database();
  }

  componentWillMount() {
    const { reportId } = this.props.params
    this.fetchReports(reportId)
  }

  fetchReports(reportId) {
    this.fbReportsRef = this.db.ref('/reports/' + reportId);
    this.fbReportsRef.once("value").then(snapshot => {
      const { date, actions, tasks, nextActions, logs, allRetro } = snapshot.val()
      this.setState({
        date: date,
        actions: actions,
        tasks: tasks,
        nextActions: nextActions,
        logs: logs,
        allRetro: allRetro
      })
    });
  }

  render() {
    return (
      <p>
        {console.log(this.state)}
        レポート詳細だよ<br />
      </p>
    );
  }
}

export default ReportDetail;
