import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import firebase from 'firebase';
import moment from 'moment';

import logo from '../../images/logo_horizontal.svg';
import plus from '../../images/plus.svg';
import minus from '../../images/minus.svg';
import plusWhite from '../../images/plus_white.svg';
import complete from '../../images/complete.svg';

class EditReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '', // レポート日時
      currentActions: [], // DBから取得したアクション
      newActions: [], // 新規追加するアクションの連想配列
      action: '', // 新規追加するアクション
      currentTasks: [], // DBから取得したタスク
      newTasks: [], // 新規追加するタスクの連想配列
      task: '', // 新規追加するタスク
      nextActions: [],  // 新規追加するネクストアクションの連想配列
      nextAction: '', // 新規追加するネクストアクション
      logs: [], // 新規追加する行動履歴の連想配列
      logItem: {
        start: null,  // 新規追加する行動履歴の開始時刻
        end: null,  // 新規追加する行動履歴の完了時刻
        log: '',  // 新規追加する行動履歴
        cause: '',  // 新規追加する行動理由
        retro: '', // 新規追加する行動振り返り
      }, // 1項目単位のログ配列
      inputStart: null, // 入力された開始時刻の一時回避場所
      inputEnd: null, // 入力された完了時刻の一時回避場所
      inputLog: '', // 入力されたログの一時回避場所
      inputCause: '', // 入力された行動理由の一時回避場所
      inputRetro: '', // 入力された振り返りの一時回避場所
      allRetro: ''  // 新規追加する全体振り返り
    }
    this.db = firebase.database();
    // アクション
    this.handleAddAction = this.handleAddAction.bind(this)
    this.handleAddActionInput = this.handleAddActionInput.bind(this)
    this.handleRemoveActionInput = this.handleRemoveActionInput.bind(this)
    // タスク
    this.handleAddTask = this.handleAddTask.bind(this)
    this.handleAddTaskInput = this.handleAddTaskInput.bind(this)
    this.handleRemoveTaskInput = this.handleRemoveTaskInput.bind(this)
    // 時刻
    this.handleStartLog = this.handleStartLog.bind(this)
    this.handleEndLog = this.handleEndLog.bind(this)
    // 新規行動履歴
    this.handleAddLog = this.handleAddLog.bind(this)
    this.handleResetLogInput = this.handleResetLogInput.bind(this)
    this.handleAddCause = this.handleAddCause.bind(this)
    this.handleResetCauseTextArea = this.handleResetCauseTextArea.bind(this)
    this.handleAddRetro = this.handleAddRetro.bind(this)
    this.handleResetRetroTextArea = this.handleResetRetroTextArea.bind(this)
    // 全体振り返り
    this.handleAllRetro = this.handleAllRetro.bind(this)
    // 次回に向けたアクション
    this.handleNextAction = this.handleNextAction.bind(this)
    this.handleAddNextActInput = this.handleAddNextActInput.bind(this)
    this.handleRemoveNextActInput = this.handleRemoveNextActInput.bind(this)
    // PDCA登録
    this.handleSetReport = this.handleSetReport.bind(this)
    this.handleCompReport = this.handleCompReport.bind(this)
  }

  componentWillMount() {
    const { reportId } = this.props.params
    this.fetchReports(reportId)
  }

  handleAddAction(e) {
    e.preventDefault();
    this.setState({ action: e.target.value })
  }

  handleAddTask(e) {
    e.preventDefault();
    this.setState({ task: e.target.value })
  }

  handleAddActionInput(e) {
    e.preventDefault();
    // 入力された値を連想配列に追加
    const { action } = this.state;
    const addAction = { action: action }
    this.state.newActions.push(addAction)

    // 新しいinputを生成
    const actionWrap = document.querySelector('.report-add-wrap--action');
    const actionDOM = document.createElement('div');
    const actionInput = document.createElement('input')
    const addBtn = document.createElement('button');
    const removeBtn = document.createElement('button')

    actionDOM.classList.add('report-add-action')
    actionInput.classList.add('md-form-input')
    actionInput.setAttribute('type', 'text')
    actionInput.setAttribute('name', 'action')
    actionInput.setAttribute('placeholder', 'コードレビューを丁寧に進める')
    actionInput.addEventListener('click', this.handleAddAction)
    actionInput.addEventListener('blur', this.handleAddAction)

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
    const actions = this.state.newActions;
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
    const addTask = { task: task }
    this.state.newTasks.push(addTask)

    // 新しいinputを生成
    const taskWrap = document.querySelector('.report-add-wrap--task');
    const taskDOM = document.createElement('div');
    const taskInput = document.createElement('input')
    const addBtn = document.createElement('button');
    const removeBtn = document.createElement('button')

    taskDOM.classList.add('report-add-task')
    taskInput.classList.add('md-form-input')
    taskInput.setAttribute('type', 'text')
    taskInput.setAttribute('name', 'action')
    taskInput.setAttribute('placeholder', 'デザイン構築')
    taskInput.addEventListener('click', this.handleAddTask)
    taskInput.addEventListener('blur', this.handleAddTask)

    addBtn.classList.add('md-btn-square')
    addBtn.classList.add('md-btn-plus')
    addBtn.innerHTML = `<img src=${plus} alt="" class="md-icon md-icon-plus" />`
    addBtn.addEventListener('click', this.handleAddTaskInput)
    removeBtn.classList.add('md-btn-square')
    removeBtn.classList.add('md-btn-minus')
    removeBtn.innerHTML = `<img src=${minus} alt="" class="md-icon md-icon-minus" />`
    removeBtn.addEventListener('click', this.handleRemoveTaskInput)

    taskDOM.appendChild(taskInput)
    taskDOM.appendChild(addBtn)
    taskDOM.appendChild(removeBtn)
    taskWrap.appendChild(taskDOM)
  }

  handleRemoveTaskInput(e) {
    e.preventDefault();
    // 該当するデータをstateの連想配列から削除
    const removeVal = e.target.previousElementSibling.previousElementSibling.value;
    const tasks = this.state.newTasks;
    for (let i = 0; i< tasks.length; i++) {
      if (tasks[i].task === removeVal) {
        tasks.splice(i, 1)
      }
    }

    // 該当するデータのDOMを削除
    const removeDOM = e.target.parentNode
    removeDOM.remove();
  }

  handleStartLog(e) {
    e.preventDefault();
    this.setState({ inputStart: moment().format('hh:mm') })
    this.state.logItem.start = moment().format('hh:mm')
  }

  handleEndLog(e) {
    e.preventDefault();
    this.setState({ inputEnd: moment().format('hh:mm') })

    const {
      inputStart,
      inputLog,
      inputCause,
      inputRetro
    } = this.state;
    this.state.logItem.start = inputStart
    this.state.logItem.end = moment().format('hh:mm')
    this.state.logItem.log = inputLog
    this.state.logItem.cause = inputCause
    this.state.logItem.retro = inputRetro
    this.state.logs.push(this.state.logItem)

    let logItem = new Object
    logItem.start = null
    logItem.end = null
    logItem.log = ''
    logItem.cause = ''
    logItem.retro = ''
    this.setState({ logItem })
  }

  handleAddLog(e) {
    e.preventDefault();
    this.setState({ inputLog: e.target.value })
  }

  handleResetLogInput(e) {
    e.preventDefault();
    e.target.value = ''
  }

  handleAddCause(e) {
    e.preventDefault();
    this.setState({ inputCause: e.target.value })
  }

  handleResetCauseTextArea(e) {
    e.preventDefault();
    e.target.value = ''
  }

  handleAddRetro(e) {
    e.preventDefault();
    this.setState({ inputRetro: e.target.value })
  }

  handleResetRetroTextArea(e) {
    e.preventDefault();
    e.target.value = ''
  }

  handleAllRetro(e) {
    e.preventDefault();
    this.setState({ allRetro: e.target.value })
  }

  handleNextAction(e) {
    e.preventDefault();
    this.setState({ nextAction: e.target.value })
  }

  handleAddNextActInput(e) {
    e.preventDefault();
    // 入力された値を連想配列に追加
    const { nextAction } = this.state;
    const newNextAction = { nextAction: nextAction }
    this.state.nextActions.push(newNextAction)

    // 新しいinputの生成
    const nextActWrap = document.querySelector('.report-add-wrap--next')
    const nextActDOM = document.createElement('div')
    const nextActInput = document.createElement('input')
    const addBtn= document.createElement('button')
    const removeBtn = document.createElement('button')

    nextActDOM.classList.add('md-form-group')
    nextActDOM.classList.add('form-action-item')
    nextActInput.classList.add('md-form-input')
    nextActInput.setAttribute('type', 'text')
    nextActInput.setAttribute('name', 'nextAction')
    nextActInput.setAttribute('placeholder', 'コミュニケーションエラーを回避する')
    nextActInput.addEventListener('click', this.handleNextAction)
    nextActInput.addEventListener('blur', this.handleNextAction)

    addBtn.classList.add('md-btn-square')
    addBtn.classList.add('md-btn-plus')
    addBtn.innerHTML = `<img src=${plus} alt="" class="md-icon md-icon-plus" />`
    addBtn.addEventListener('click', this.handleAddNextActInput)
    removeBtn.classList.add('md-btn-square')
    removeBtn.classList.add('md-btn-minus')
    removeBtn.innerHTML = `<img src=${minus} alt="" class="md-icon md-icon-minus" />`
    removeBtn.addEventListener('click', this.handleRemoveNextActInput)

    nextActDOM.appendChild(nextActInput)
    nextActDOM.appendChild(addBtn)
    nextActDOM.appendChild(removeBtn)
    nextActWrap.appendChild(nextActDOM)
  }

  handleRemoveNextActInput(e) {
    e.preventDefault();

    // 該当するデータをstateの連想配列から削除
    const removeVal = e.target.previousElementSibling.previousElementSibling.value;
    const nextActions = this.state.nextActions;
    for (let i = 0; i< nextActions.length; i++) {
      if (nextActions[i].nextAction === removeVal) {
        nextActions.splice(i, 1)
      }
    }
    
    // 該当するデータのDOMを削除
    const removeDOM = e.target.parentNode
    removeDOM.remove();
  }

  fetchReports(reportId) {
    this.fbReportsRef = this.db.ref('/reports/' + reportId);
    this.fbReportsRef.once("value").then(snapshot => {
      const { date, actions, tasks } = snapshot.val()
      this.setState({
        date: date,
        currentActions: actions,
        currentTasks: tasks
      })
    });
  }

  handleSetReport(e) {
    e.preventDefault();
    const setReportRef = this.db.ref('/reports').push();
    const editLog = {
      actions: this.state.currentActions.concat(this.state.newActions),
      tasks: this.state.currentTasks.concat(this.state.newTasks),
      logs: this.state.logs,
      retro: this.state.allRetro,
      nextActions: this.state.nextActions
    }

    setReportRef.update(editLog).then(() => {
      console.log('Report edit completed.')
      hashHistory.push('/reports')
    })
  }

  handleCompReport(e) {
    e.preventDefault();
    const setReportRef = this.db.ref('/reports').push();
    const editLog = {
      actions: this.state.currentActions.concat(this.state.newActions),
      tasks: this.state.currentTasks.concat(this.state.newTasks),
      logs: this.state.logs,
      retro: this.state.allRetro,
      nextActions: this.state.nextActions
    }

    setReportRef.update(editLog).then(() => {
      console.log('Report edit completed.')
      hashHistory.push(`/reports/report/${setReportRef.key}`)
    })
  }

  render() {
    const { date, currentActions, currentTasks } = this.state;
    const logs = this.state.logs;
    return (
      <div id="l-contain">
        <header className="l-header md-header">
          <div className="l-header-wrap">
            <img src={logo} alt="RIOT" className="md-img md-img-logo" />
          </div>
        </header>
        <section className="md-section reportsDetail-section">
          <div className="md-wrapper">
            <h2 className="md-title md-title-h2">PDCA編集</h2>
            <div className="md-inner">
              <h3 className="md-title md-title-h3">{date}</h3>
              <form className="md-form">
                <div className="md-form-group">
                  <label>アクション</label>
                  <ul className="report-action-list">
                    {currentActions.map((a, i) => {
                      return (
                        <li className="report-action-item" key={i}>{a.action}</li>
                      )
                    })}
                  </ul>
                  <div className="report-add-wrap--action">
                    <div className="report-add-action">
                      <input
                        type="text"
                        name="action"
                        placeholder="コードレビューを丁寧に進める"
                        className="md-form-input"
                        onChange={this.handleAddAction}
                        onBlur={this.handleAddAction}
                      />
                      <button className="md-btn-square md-btn-plus" onClick={this.handleAddActionInput}><img src={plus} alt="" className="md-icon md-icon-plus" /></button>
                      <button className="md-btn-square md-btn-minus" onClick={this.handleRemoveActionInput}><img src={minus} alt="" className="md-icon md-icon-minus" /></button>
                    </div>
                  </div>
                </div>
                <div className="md-form-group">
                  <label>タスク</label>
                  <ul className="report-task-list">
                    {currentTasks.map((t, i) => {
                      return (
                        <div className="report-task-checkbox" key={i}>
                          <label className="md-control">
                            <input type="checkbox" name="task" value={i} />
                            <span className="md-icon md-icon-checkbox" />
                            <span className="md-text md-task-name">
                              {t.task}
                            </span>
                          </label>
                        </div>
                      )
                    })}
                  </ul>
                  <div className="report-add-wrap--task">
                    <div className="report-add-task">
                      <input
                        type="text"
                        name="task"
                        placeholder="デザイン構築"
                        className="md-form-input"
                        onChange={this.handleAddTask}
                        onBlur={this.handleAddTask}
                      />
                      <button className="md-btn-square md-btn-plus" onClick={this.handleAddTaskInput}><img src={plus} alt="" className="md-icon md-icon-plus" /></button>
                      <button className="md-btn-square md-btn-minus" onClick={this.handleRemoveTaskInput}><img src={minus} alt="" className="md-icon md-icon-minus" /></button>
                    </div>
                  </div>
                </div>
                <div className="md-form-group">
                  <label>行動履歴</label>
                  <div className="md-log-item">
                    <div className="log-view-wrap">
                    {logs.map((item, i) => {
                      return (
                        <div className="log-view-box" key={i}>
                          <p className="md-time">
                            <span className="md-time--start">{item.start}</span>
                            <span className="md-time--span">〜</span>
                            <span className="md-time--end">{item.end}</span>
                          </p>
                          <p className="md-log">{item.log}</p>
                          <p className="md-cause">{item.cause}</p>
                          <p className="md-retro">{item.retro}</p>
                        </div>
                      )
                    })}
                    </div>
                    <div className="md-add-log-wrap">
                      <input
                        type="text"
                        name="log"
                        placeholder="朝会"
                        className="md-form-input md-form-input--log"
                        onChange={this.handleAddLog}
                        onBlur={this.handleResetLogInput}
                      />
                      <div className="md-cause-wrap">
                        <h4 className="md-title md-title-h4">行動理由</h4>
                        <textarea
                          name="cause"
                          placeholder="dockerに新しいコンテナを立てる必要がある為"
                          onChange={this.handleAddCause}
                          onBlur={this.handleResetCauseTextArea}
                        />
                      </div>
                      <div className="md-retrospective-wrap">
                        <h4 className="md-title md-title-h4">振り返り</h4>
                        <textarea
                          name="retrospective"
                          placeholder="docker-compose downを癖で打ってしまうのを治したいところ"
                          onChange={this.handleAddRetro}
                          onBlur={this.handleResetRetroTextArea}
                        />
                      </div>
                      <div className="log-btn-wrap">
                        <button className="md-btn md-btn--style03 md-btn--color01" onClick={this.handleStartLog}><span className="md-btn-name">開始</span></button>
                        <button className="md-btn md-btn--style03 btn--color02" onClick={this.handleEndLog}><span className="md-btn-name">完了</span></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md-form-group">
                  <label>全体振り返り</label>
                  <textarea
                    name="retrospective"
                    onChange={this.handleAllRetro}
                    onBlur={this.handleAllRetro}
                  />
                </div>
                <div className="md-form-group">
                  <label>次回に向けたアクション</label>
                  <div className="report-add-wrap--next">
                    <div className="md-form-group form-action-item">
                      <input
                        type="text"
                        name="action"
                        placeholder="コードレビューを丁寧に進める"
                        className="md-form-input"
                        onChange={this.handleNextAction}
                        onBlur={this.handleNextAction}
                      />
                      <button className="md-btn-square md-btn-plus" onClick={this.handleAddNextActInput}><img src={plus} alt="" className="md-icon md-icon-plus" /></button>
                      <button className="md-btn-square md-btn-minus" onClick={this.handleRemoveNextActInput}><img src={minus} alt="" className="md-icon md-icon-minus" /></button>
                    </div>
                  </div>
                </div>
                <div className="set-task-wrap">
                  <Link to="/reports" className="md-btn md-btn--style02" onClick={this.handleSetReport}>
                    <img src={plusWhite} alt="" className="md-icon md-icon-set" />
                    <span className="md-btn-name">Set task</span>
                  </Link>
                  <Link to="/reports/report/:reportId" className="md-btn md-btn--style02 btn--color03" onClick={this.handleCompReport}>
                    <img src={complete} alt="" className="md-icon md-icon-complete" />
                    <span className="md-btn-name">Completed</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default EditReport;
