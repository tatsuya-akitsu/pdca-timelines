import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/src/stylesheets/datepicker.scss';

import GlobalHeader from './header';
import logo from '../../images/logo_horizontal.svg';
import thumb from '../../images/reports_add.svg';
import addTask from '../../images/tasks-solid.svg';
import angle from '../../images/angle_down.svg';

class AddReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      actions: [],
      action: '',
      tasks: [],
      task: '',
    }

    this.db = firebase.database();
    // 日付
    this.handleOnDate = this.handleOnDate.bind(this);
    // アクション
    this.handleOnAction = this.handleOnAction.bind(this);
    this.handleAddActionInput = this.handleAddActionInput.bind(this);
    this.handleRemoveActionInput = this.handleRemoveActionInput.bind(this);
    // タスク
    this.handleOnTask = this.handleOnTask.bind(this);
    this.handleAddTaskInput = this.handleAddTaskInput.bind(this);
    this.handleRemoveTaskInput = this.handleRemoveTaskInput.bind(this);
    // 送信
    this.handleAddReports = this.handleAddReports.bind(this);
  }

  handleOnDate(date) {
    this.setState({ date: date })
  }

  handleOnAction(e) {
    e.preventDefault();
    this.setState({ action: e.target.value })
  }

  handleOnTask(e) {
    e.preventDefault();
    this.setState({ task: e.target.value })
  }

  handleAddActionInput(e) {
    e.preventDefault();
    // 入力された値を連想配列に追加
    const action = this.state.action
    this.state.actions.push(action)
    const input = document.getElementsByClassName('md-form-input--action')
    input[0].value = ""
    this.setState({ action: '' })
  }

  handleRemoveActionInput(e) {
    e.preventDefault();

    // 該当するデータをstateの連想配列から削除
    const removeVal = e.target.previousElementSibling.previousElementSibling.value;
    const actions = this.state.actions;
    for (let i = 0; i< actions.length; i++) {
      if (actions[i].action === removeVal) {
        actions.splice(i, 1)
      }
    }

    // 該当するデータのDOMを削除
    const removeDOM = e.target.parentNode
    removeDOM.remove();
  }

  handleAddTaskInput(e) {
    e.preventDefault();
    // 入力された値を連想配列に追加
    const task = this.state.task
    this.state.tasks.push(task)
    const input = document.getElementsByClassName('md-form-input--task')
    input[0].value = ""
    this.setState({ task: '' })
  }

  handleRemoveTaskInput(e) {
    e.preventDefault();

    // 該当するデータをstateの連想配列から削除
    const removeVal = e.target.previousElementSibling.previousElementSibling.value;
    const tasks = this.state.tasks;
    for (let i = 0; i< tasks.length; i++) {
      if (tasks[i].task === removeVal) {
        tasks.splice(i, 1)
      }
    }

    // 該当するデータのDOMを削除
    const removeDOM = e.target.parentNode
    removeDOM.remove();
  }

  handleAddReports(e) {
    e.preventDefault();
    const { date, actions, tasks } = this.state;
    const fmtDate = moment(date).format('YYYY/MM/DD')

    const newReportsRef = this.db.ref('/reports').push();
    const newReports = {
      date: fmtDate,
      actions: actions,
      tasks: tasks,
      logs: [],
      retro: '',
      nextActions: []
    }

    newReportsRef.update(newReports).then(() => {
      this.setState({
        date: moment(),
        actions: [],
        tasks: []
      })
      hashHistory.push('/reports')
    })
  }

  render() {
    return (
      <div id="l-contain">
        <GlobalHeader />
        <section className="md-section-header md-section-header--color01">
          <div className="md-wrapper">
            <div className="md-section-header-inner fleB">
              <div className="md-section-header--leftPanel">
                <h2 className="md-title md-title-h2--small">PDCA新規作成</h2>
                <p className="md-text main-desc">
                  PDCAを新規作成できます。<br />
                  一日の始まりはこの画面から始めましょう。<br />
                  簡単に日付とタスク、意識する項目を設定するだけで作成が可能です。
                </p>
              </div>
              <div className="md-section-header--rightPanel">
                <img src={thumb} alt="" className="md-thumb md-thumb--reportsTop" />
              </div>
            </div>
          </div>
        </section>
        <section className="md-section md-section--report">
          <div className="md-wrapper">
            <div className="md-inner">
              <form onSubmit={this.handleAddReports} className="md-form md-form--report">
                <div className="md-form-group">
                  <label>日付</label>
                  <div className="datepicker-wrap">
                    <DatePicker
                      dateFormat="YYYY/MM/DD"
                      selected={this.state.date}
                      onChange={this.handleOnDate}
                    />
                    <img src={angle} alt="" className="md-icon md-icon-angle" />
                  </div>
                </div>
                <div className="md-form-group">
                  <label>アクション</label>
                  <ul className="form-list">
                    {this.state.actions.map((a, i) => {
                      return (
                        <li className="form-item" key={i}>
                          <span className="form-item-name">{a}</span>
                          <button className="md-btn-square md-btn-minus posR" onClick={this.handleRemoveActionInput} />
                        </li>
                      )
                    })}
                  </ul>
                  <div className="md-form-item">
                    <input
                      type="text"
                      name="action"
                      placeholder="コードレビューを丁寧に進める"
                      className="md-form-input md-form-input--action"
                      onChange={this.handleOnAction}
                      onBlur={this.handleOnAction}
                    />
                    <button className="md-btn-square md-btn-plus posR" onClick={this.handleAddActionInput} />
                  </div>
                </div>
                <div className="md-form-group">
                  <label>タスク</label>
                  <ul className="form-list">
                    {this.state.tasks.map((t, i) => {
                      return (
                        <li className="form-item" key={i}>
                          <span className="form-item-name">{t}</span>
                          <button className="md-btn-square md-btn-minus posR" onClick={this.handleRemoveTaskInput} />
                        </li>
                      )
                    })}
                  </ul>
                  <div className="md-form-item">
                    <input
                      type="text"
                      name="task"
                      placeholder="デザイン構築"
                      className="md-form-input md-form-input--task"
                      onChange={this.handleOnTask}
                      onBlur={this.handleOnTask}
                    />
                    <button className="md-btn-square md-btn-plus posR" onClick={this.handleAddTaskInput} />
                  </div>
                </div>
                <div className="md-form-group">
                  <button className="md-btn md-btn--style02" onClick={this.handleSubmitReports}>
                    <img src={addTask} alt="" className="md-icon md-icon-tasks" />
                    <span className="md-btn-name">タスクを作成する</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AddReport;
