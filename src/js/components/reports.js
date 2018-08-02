import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import ReportsItem from './reportsItem';

import logo from '../../images/logo_horizontal.svg';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    }

    this.db = firebase.database();
  }

  componentDidMount() {
    this.fetchReports();
  }

  fetchReports() {
    return this.db.ref('/reports').limitToLast(20).once('value').then(snapshot => {
      const reports = [];
      snapshot.forEach(item => {
        reports.push(Object.assign({key: item.key}, item.val()))
      });
      this.setState({ reports })
    });
  }

  render() {
    const reportsId = this.props.params;
    const { reports } = this.state;
    return (
      <div id="l-contain">
        <header className="l-header md-header">
          <div className="l-header-wrap">
            <img src={logo} alt="RIOT" className="md-img md-img-logo" />
          </div>
        </header>
        <section className="md-section reports-section">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2">PDCA一覧</h2>
            <div className="md-inner">
              <ul className="report-list">
                {reports.map(r => <ReportsItem report={r} key={r.key} selected={r.key === reportsId} />)}
              </ul>
              <Link to="/reports/report/add">
                <span className="md-btn-name">新規追加</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Reports;
