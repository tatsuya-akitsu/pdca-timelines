import React, { Component } from 'react';
import { Link } from 'react-router';

import check from '../../images/check.svg';
import list from '../../images/list.svg';

class ReportsItem extends Component {
  render() {
    const { selected } = this.props;
    const { actions, tasks, nextActions, key } = this.props.report;
    const date = this.props.report.date;
    const day = date.split('/')
    return (
      <li className={ selected ? 'reports-item is-selected' : 'reports-item' }>
        <div className="reports-wrap">
          <div className="reports-panel-left">
            <p className="md-text report-day">{day[2]}</p>
            <p className="md-text report-date">{day[0] + '.' + day[1]}</p>
          </div>
          <div className="reports-panel-right">
            <div className="report-task-wrap">
              <p className="md-title md-tasks-title">Tasks</p>
              <ul className="report-task-list">
                {tasks.map((t, i) => {
                  return (
                    <li className="report-task-item" key={i}>{t.task}</li>
                  );
                })}
              </ul>
            </div>
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
              <Link to={`/reports/report/${key}/edit`} className="md-btn md-btn--style03">
                <img src={check} alt="" className="md-icon md-icon-edit" />
                <span className="md-btn-name">編集</span>
              </Link>
              <Link to={`/reports/report/${key}`} className="md-btn md-btn--style03 btn--color01">
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
