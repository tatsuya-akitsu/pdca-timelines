import React, { Component } from 'react';
import { Link } from 'react-router';

import check from '../../images/check.svg';
import list from '../../images/list.svg';

class ReportsItem extends Component {
  render() {
    const { selected } = this.props;
    const { date, actions, tasks, nextActions, key } = this.props.report;
    return (
      <li className={ selected ? 'reports-item is-selected' : 'reports-item' }>
        <div className="reports-wrap">
          <div className="reports-panel-left">
            <p className="report-date">{date}</p>
          </div>
          <div className="reports-panel-right">
            <ul className="report-task-list">
              {tasks.map((t, i) => {
                return (
                  <li className="report-task-item" key={i}>{t.task}</li>
                );
              })}
            </ul>
            <div className="report-detail">
              <div className="report-detail-item">
                <p className="md-title md-title-small">actions</p>
                <p className="md-num md-num--style01">{actions.length}</p>
              </div>
              <div className="report-detail-item">
                <p className="md-title md-title-small">tasks</p>
                <p className="md-num md-num--style01">{tasks.length}</p>
              </div>
              <div className="report-detail-item">
                <p className="md-title md-title-small">nextActions</p>
                { nextActions > 0 ? <p className="md-num md-num--style01">{nextActions.length}</p> : <p className="md-num md-num--style01">0</p> }
              </div>
            </div>
            <div className="report-btn-wrap">
              <Link to={`/reports/report/${key}/edit`}>
                <img src={check} alt="" className="md-icon md-icon-edit" />
                <span className="md-btn-name">編集</span>
              </Link>
              <Link to={`/reports/report/${key}`}>
                <img src={list} alt="" className="md-icon md-icon-view" />
                <span className="md-btn-name">閲覧</span>
              </Link>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ReportsItem;
