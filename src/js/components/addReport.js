import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import firebase from 'firebase';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/src/stylesheets/datepicker.scss';

import logo from '../../images/logo_horizontal.svg';
import addTask from '../../images/tasks-solid.svg';
import angle from '../../images/angle_down.svg';
import plus from '../../images/plus.svg';
import minus from '../../images/minus.svg';

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
    const { action } = this.state;
    const newAction = {
      action: action
    }
    this.state.actions.push(newAction)

    // 新しいinputの生成
    const actionWrap = document.querySelector('.form-action-group')
    const actionDOM = document.createElement('div');
    const actionInput = document.createElement('input');
    const addBtn = document.createElement('button')
    const removeBtn = document.createElement('button')

    actionDOM.classList.add('md-form-item')
    actionDOM.classList.add('form-action-item')
    actionInput.classList.add('md-form-input')
    actionInput.setAttribute('type', 'text')
    actionInput.setAttribute('name', 'action')
    actionInput.setAttribute('placeholder', 'コードレビューを丁寧に進める')
    actionInput.addEventListener('click', this.handleOnAction)
    actionInput.addEventListener('blur', this.handleOnAction)

    addBtn.classList.add('md-btn-square')
    addBtn.classList.add('md-btn-plus')
    addBtn.innerHTML = `<img src=${plus} alt="" class="md-icon md-icon-plus" />`
    addBtn.addEventListener('click', this.handleAddActionInput)
    removeBtn.classList.add('md-btn-square')
    removeBtn.classList.add('md-btn-minus')
    removeBtn.innerHTML = `<img src=${minus} alt="" class="md-icon md-icon-minus" />`
    removeBtn.addEventListener('click', this.handleRemoveActionInput)

    actionDOM.appendChild(actionInput)
    actionDOM.appendChild(addBtn)
    actionDOM.appendChild(removeBtn)
    actionWrap.appendChild(actionDOM)
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
    const { task } = this.state;
    const newTask = {
      task: task
    }
    this.state.tasks.push(newTask)

    // 新しいinputの生成
    const taskWrap = document.querySelector('.form-task-group')
    const taskDOM = document.createElement('div');
    const taskInput = document.createElement('input');
    const addBtn = document.createElement('button')
    const removeBtn = document.createElement('button')

    taskDOM.classList.add('md-form-item')
    taskDOM.classList.add('form-task-item')
    taskInput.classList.add('md-form-input')
    taskInput.setAttribute('type', 'text')
    taskInput.setAttribute('name', 'action')
    taskInput.setAttribute('placeholder', 'デザイン構築')
    taskInput.addEventListener('click', this.handleOnTask)
    taskInput.addEventListener('blur', this.handleOnTsk)

    addBtn.classList.add('md-btn-square')
    addBtn.classList.add('md-btn-plus')
    addBtn.innerHTML = `<img src=${plus} alt="" class="md-icon md-icon-plus" />`
    addBtn.addEventListener('click', this.handleAddTaskInput)
    removeBtn.classList.add('md-btn-square')
    removeBtn.classList.add('md-btn-minus')
    removeBtn.innerHTML = `<img src=${minus} alt="" class="md-icon md-icon-minus" />`
    removeBtn.addEventListener('click', this.handleRemoveActionInput)

    taskDOM.appendChild(taskInput)
    taskDOM.appendChild(addBtn)
    taskDOM.appendChild(removeBtn)
    taskWrap.appendChild(taskDOM)
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
      tasks: tasks
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
        <header className="l-header md-header">
          <div className="l-header-wrap">
            <img src={logo} alt="RIOT" className="md-img md-img-logo" />
          </div>
        </header>
        <section className="md-section addReports-section">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2">PDCA新規作成</h2>
            <div className="md-inner">
              <form onSubmit={this.handleAddReports} className="md-form">
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
                <div className="form-action-group">
                  <label>アクション</label>
                  <div className="md-form-group form-action-item">
                    <input
                      type="text"
                      name="action"
                      placeholder="コードレビューを丁寧に進める"
                      className="md-form-input"
                      onChange={this.handleOnAction}
                      onBlur={this.handleOnAction}
                    />
                    <button className="md-btn-square md-btn-plus" onClick={this.handleAddActionInput}><img src={plus} alt="" className="md-icon md-icon-plus" /></button>
                    <button className="md-btn-square md-btn-minus" onClick={this.handleRemoveActionInput}><img src={minus} alt="" className="md-icon md-icon-minus" /></button>
                  </div>
                </div>
                <div className="form-task-group">
                  <label>タスク</label>
                  <div className="md-form-group form-task-item">
                    <input
                      type="text"
                      name="task"
                      placeholder="デザイン構築"
                      className="md-form-input"
                      onChange={this.handleOnTask}
                      onBlur={this.handleOnTask}
                    />
                    <button className="md-btn-square md-btn-plus" onClick={this.handleAddTaskInput}><img src={plus} alt="" className="md-icon md-icon-plus" /></button>
                    <button className="md-btn-square md-btn-minus" onClick={this.handleRemoveTaskInput}><img src={minus} alt="" className="md-icon md-icon-minus" /></button>
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
