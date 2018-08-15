import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import GlobalHeader from './header';
import ReportsItem from './reportsItem';

import thumb from '../../images/reports_top.svg';

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
        <GlobalHeader />
        <section className="md-section md-section--reportsList">
          <section className="md-section-header">
            <div className="md-wrapper">
              <div className="md-section-header-inner fleB">
                <div className="md-section-header--leftPanel">
                  <h2 className="md-title md-title-h2--small">PDCA一覧</h2>
                  <p className="md-text main-desc">
                    登録したPDCAを一覧で確認できます。<br />
                    新規作成･編集･詳細確認等こちらから可能です。<br />
                    また、月別のソート、CSVダウンロードも可能です。
                  </p>
                </div>
                <div className="md-section-header--rightPanel">
                  <img src={thumb} alt="" className="md-thumb md-thumb--reportsTop" />
                </div>
              </div>
            </div>
          </section>
          <div className="md-wrapper">
            <div className="md-inner">
              <ul className="report-list">
                {reports.map(r => <ReportsItem report={r} key={r.key} selected={r.key === reportsId} />)}
              </ul>
              <Link to="/reports/report/add" className="md-btn md-btn--style01">
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
