import React, { Component } from 'react';
import { Link } from 'react-router';

import sun from '../../images/sun.svg';
import rain from '../../images/rain.svg';
import night from '../../images/night.svg';
import action from '../../images/action_list.svg';
import nextAction from '../../images/next_action_icon.svg';
import task from '../../images/task_list.svg';
import edit from '../../images/edit.svg';
import list from '../../images/list.svg';

class ReportsItem extends Component {
  render() {
    const { selected } = this.props;
    const { date, actions, tasks, nextActions, key } = this.props.report;
    return (
      <li className={ selected ? 'reports-item is-selected' : 'reports-item' } key={key}>
        <div className="reports-wrap">
          <div className="reports-card-head posR">
            <div className="report-btn-wrap posA">
              <Link to={`/reports/report/${key}/edit`} className="md-btn md-btn--style03">
                <img src={edit} alt="" className="md-icon md-icon-edit" />
              </Link>
              <Link to={`/reports/report/${key}`} className="md-btn md-btn--style03 btn--color01">
                <img src={list} alt="" className="md-icon md-icon-view" />
              </Link>
            </div>
            <div className="reports-status-icon posR">
              {tasks.length > 2 && tasks.length < 4 ? 
                <img src={night} alt="" className="md-icon md-icon-weather posA" />
              : null}
              {tasks.length > 5 && tasks.length < 6 ?
                <img src={rain} alt="" className="md-icon md-icon-weather posA" />
              : null}
              {tasks.length > 7 ?
                <img src={sun} alt="" className="md-icon md-icon-weather posA" />
              : null}
            </div>
            <p className="md-text report-date">{date}</p>
          </div>
          <div className="reports-card-body">
            <div className="report-task-wrap">
              <p className="md-title md-tasks-title">Tasks</p>
              <ul className="report-task-list">
                {tasks.map((t) => {
                  return (
                    <li className="form-item">{t}</li>
                  );
                })}
              </ul>
            </div>
            <div className="report-detail">
              <div className="report-detail-item">
                <p className="md-title md-title-small">actions</p>
                <div className="report-detail-box">
                  <img src={action} alt="" className="md-icon md-icon-actionBadge" />
                  <p className="md-num md-num--style01">{actions.length}</p>
                </div>
              </div>
              <div className="report-detail-item">
                <p className="md-title md-title-small">tasks</p>
                <div className="report-detail-box">
                  <img src={task} alt="" className="md-icon md-icon-taskBadge" />
                  <p className="md-num md-num--style01">{tasks.length}</p>
                </div>
              </div>
              <div className="report-detail-item">
                <p className="md-title md-title-small">nextActions</p>
                <div className="report-detail-box">
                  <img src={nextAction} alt="" className="md-icon md-icon-nextActBadge" />
                  {(() => {
                    if (nextActions) {
                      if (nextActions.length > 0) {
                        return (
                          <p className="md-num md-num--style01">{nextActions.length}</p>
                        )
                      }
                    } else {
                      return (
                        <p className="md-num md-num--style01">0</p>
                      )
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ReportsItem;
