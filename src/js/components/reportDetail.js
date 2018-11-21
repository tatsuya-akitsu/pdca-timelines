import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class ReportDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      date: null,
      actions: [],
      tasks: [],
      nextActions: [],
      logs: [],
      allRetro: ''
    }
    this.db = firebase.firestore();
  }

  componentWillMount() {
    this.fetchReports()
  }

  fetchReports() {
    this.setState({ uid: firebase.auth().currentUser.uid })
    const uid = firebase.auth().currentUser.uid
    const { reportId } = this.props.params
    this.db.collection(uid).doc(reportId).get().then((doc) => {
      console.log(doc.data())
      const { date, actions, tasks, logs, retro, nextActions } = doc.data()
      this.setState({
        date: date,
        actions: actions,
        tasks: tasks,
        nextActions: nextActions,
        logs: logs,
        allRetro: retro
      })
    })
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
