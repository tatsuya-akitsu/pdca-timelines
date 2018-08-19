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

    this.db = firebase.firestore();
  }

  componentDidMount() {
    this.fetchReports();
  }

  fetchReports() {
    const uid = firebase.auth().currentUser.uid;
    return this.db.collection(uid).get().then((querySnapshot) => {
      const reports = []
      querySnapshot.forEach((doc) => {
        reports.push(Object.assign({key: doc.id}, doc.data()))
      })
      this.setState({ reports, })
    })
  }

  render() {
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
                {reports.map((r) => {
                  return (
                    <ReportsItem report={r} key={r.key} />
                  )
                })}
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
