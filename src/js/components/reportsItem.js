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
      <li className={ selected ? 'reports-item is-selected' : 'reports-item' }>
        <div className="reports-wrap">
          <div className="reports-panel-left">
            <p className="md-text report-date">{date}</p>
            <div className="report-btn-wrap">
              <Link to={`/reports/report/${key}/edit`} className="md-btn md-btn--style03">
                <img src={edit} alt="" className="md-icon md-icon-edit" />
                <span className="md-btn-name">編集</span>
              </Link>
              <Link to={`/reports/report/${key}`} className="md-btn md-btn--style03 btn--color01">
                <img src={list} alt="" className="md-icon md-icon-view" />
                <span className="md-btn-name">閲覧</span>
              </Link>
            </div>
          </div>
          <div className="reports-panel-right">
            {(() => {
              if (task.length > 2) {
                return (
                  <img src={night} alt="" className="md-icon md-icon-weather" />
                )
              } else if (task.length > 5) {
                return (
                  <img src={rain} alt="" className="md-icon md-icon-weather" />
                )
              } else if (task.length > 7) {
                return (
                  <img src={sun} alt="" className="md-icon md-icon-weather" />
                )
              }
            })()}
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
                  { nextActions > 0 ? <p className="md-num md-num--style01">{nextActions.length}</p> : <p className="md-num md-num--style01">0</p> }
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
