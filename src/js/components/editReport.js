import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import firebase from 'firebase';
import moment from 'moment';

import GlobalHeader from './header';
import thumb from '../../images/reports_edit.svg';
import edit from '../../images/edit--color02.svg';
import time from '../../images/time.svg';
import cause from '../../images/cause.svg';
import analysis from '../../images/analysis.svg';
import plusWhite from '../../images/plus_white.svg';
import complete from '../../images/complete.svg';

// 連想配列に値が存在するか否か確認
function isEmpty(obj) {
  for (let i in obj) {
    return false;
  }
  return true;
}

class EditReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',  // ユーザーID
      date: '', // レポート日時
      currentActions: [], // DBから取得したアクション
      newActions: [], // 新規追加するアクションの連想配列
      action: '', // 新規追加するアクション
      currentTasks: [], // DBから取得したタスク
      newTasks: [], // 新規追加するタスクの連想配列
      task: '', // 新規追加するタスク
      nextActions: [],  // 新規追加するネクストアクションの連想配列
      nextAction: '', // 新規追加するネクストアクション
      currentNextActions: [], // DBから取得したネクストアクション
      currentLogs: [], // DBから取得したログ
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
    this.db = firebase.firestore();
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
    this.fetchReports()
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
    const action = this.state.action
    this.state.newActions.push(action)

    // 新しいinputを生成
    const actionWrap = document.querySelector('.md-item-add--action');
    const actionDOM = document.createElement('div');
    const actionInput = document.createElement('input')
    const addBtn = document.createElement('button');
    const removeBtn = document.createElement('button')

    actionDOM.classList.add('report-add-action')
    actionInput.setAttribute('type', 'text')
    actionInput.setAttribute('name', 'action')
    actionInput.setAttribute('placeholder', 'コードレビューを丁寧に進める')
    actionInput.classList.add('md-form-input')
    actionInput.addEventListener('click', this.handleAddAction)
    actionInput.addEventListener('blur', this.handleAddAction)

    addBtn.classList.add('md-btn-square', 'md-btn-plus', 'posR')
    addBtn.addEventListener('click', this.handleAddActionInput)
    removeBtn.classList.add('md-btn-square', 'md-btn-minus', 'posR')
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
    const task = this.state.task
    this.state.newTasks.push(task)

    // 新しいinputを生成
    const taskWrap = document.querySelector('.md-item-add--task');
    const taskDOM = document.createElement('div');
    const taskInput = document.createElement('input')
    const addBtn = document.createElement('button');
    const removeBtn = document.createElement('button')

    taskDOM.classList.add('report-add-task')
    taskInput.setAttribute('type', 'text')
    taskInput.setAttribute('name', 'action')
    taskInput.setAttribute('placeholder', 'デザイン構築')
    taskInput.classList.add('md-form-input')
    taskInput.addEventListener('click', this.handleAddTask)
    taskInput.addEventListener('blur', this.handleAddTask)

    addBtn.classList.add('md-btn-square', 'md-btn-plus', 'posR')
    addBtn.addEventListener('click', this.handleAddTaskInput)
    removeBtn.classList.add('md-btn-square', 'md-btn-minus', 'posR')
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

  handleCheck(id) {
    const nextState = this.state.currentTasks.map((t, i) => {
      console.log(t, i)
      return {
        id: t.id,
        task: t.task,
        check: (t.id === id ? !t.check: t.check)
      }
    })

    console.log(nextState)
    this.setState({ currentTasks: nextState })
  }

  handleStartLog(e) {
    e.preventDefault();
    this.setState({ inputStart: moment().format('hh:mm') })
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
    const nextAction = this.state.nextAction
    this.state.nextActions.push(nextAction)
    const input = document.getElementsByClassName('md-form-input--next')
    input[0].value = ""
    this.setState({ nextAction: '' })
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

  fetchReports() {
    this.setState({ uid: firebase.auth().currentUser.uid })
    const uid = firebase.auth().currentUser.uid
    const { reportId } = this.props.params
    const userDataRef = this.db.collection(uid)
    userDataRef.doc(reportId).get().then((doc) => {
      console.log(doc.data())
      const { date, actions, tasks, logs, nextActions } = doc.data()
      this.setState({
        date: date,
        currentActions: actions,
        currentTasks: tasks,
        currentLogs: logs,
        currentNextActions: nextActions
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  handleSetReport(e) {
    e.preventDefault();
    const { reportId } = this.props.params;
    const uid = this.state.uid
    let newLogs = [];
    let newNextActions = [];
    const editActions = this.state.currentActions.concat(this.state.newActions)
    const editTasks = this.state.currentTasks.concat(this.state.newTasks)

    if (isEmpty(this.state.currentLogs) === false) {
      newLogs = this.state.currentLogs.concat(this.state.logs)
    } else {
      newLogs = this.state.logs
    }

    if (isEmpty(this.state.currentNextActions) === false) {
      newNextActions = this.state.currentNextActions.concat(this.state.newActions)
    } else {
      newNextActions = this.state.nextActions
    }

    const editLog = {
      date: this.state.date,
      actions: editActions,
      tasks: editTasks,
      logs: newLogs,
      retro: this.state.allRetro,
      nextActions: newNextActions
    }

    return this.db.collection(uid).doc(reportId).update(editLog)
    .then(() => {
      console.log('Report edit Completed')
      this.props.history.push('/reports')
    }).catch((error) => {
      console.log(error)
    })
  }

  handleCompReport(e) {
    e.preventDefault();
    const { reportId } = this.props.params;
    const uid = this.state.uid
    let newLogs = [];
    let newNextActions = [];
    const editActions = this.state.currentActions.concat(this.state.newActions)
    const editTasks = this.state.currentTasks.concat(this.state.newTasks)

    if (isEmpty(this.state.currentLogs) === false) {
      newLogs = this.state.currentLogs.concat(this.state.logs)
    } else {
      newLogs = this.state.logs
    }

    if (isEmpty(this.state.currentNextActions) === false) {
      newNextActions = this.state.currentNextActions.concat(this.state.newActions)
    } else {
      newNextActions = this.state.nextActions
    }

    const editLog = {
      date: this.state.date,
      actions: editActions,
      tasks: editTasks,
      logs: newLogs,
      retro: this.state.allRetro,
      nextActions: newNextActions
    }

    return this.db.collection(uid).doc(reportId).update(editLog)
    .then(() => {
      console.log('Report edit Completed')
      this.props.history.push(`/reports/report/${reportId}`)
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    const { date, currentActions, currentTasks, currentLogs, currentNextActions } = this.state;
    const logs = this.state.logs;
    return (
      <div id="l-contain">
        <GlobalHeader />
        <section className="md-section-header md-section-header--color02">
          <div className="md-wrapper">
            <div className="md-section-header-inner fleB">
              <div className="md-section-header--leftPanel">
                <h2 className="md-title md-title-h2--small">PDCA編集</h2>
                <p className="md-text main-desc">
                  作成したPDCAに実際に行動履歴を付けていきます。<br />
                  ひとつひとつのタスクも細分化し、どの作業にどれくらいかかったのか、何故その作業を行ったか、その結果どうなったかなど丁寧につけていきましょう。<br />
                  最後に全体の振り返りと、翌日への意識する項目を入力して完了です。
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
            <h2 className="md-title md-title-h2--small">PDCA編集</h2>
            <div className="md-inner">
              <h3 className="md-title md-title-h3">{date}</h3>
              <form className="md-form md-form--report md-form--editReport">
                <div className="md-form-group">
                  <label>アクション</label>
                  <ul className="form-list">
                    {currentActions.map((a, i) => {
                      return (
                        <li className="form-item" key={i}>{a}</li>
                      )
                    })}
                  </ul>
                  <div className="md-form-item md-item-add--action">
                    <div className="report-add-action">
                      <input
                        type="text"
                        name="action"
                        placeholder="コードレビューを丁寧に進める"
                        className="md-form-input"
                        onChange={this.handleAddAction}
                        onBlur={this.handleAddAction}
                      />
                      <button className="md-btn-square md-btn-plus posR" onClick={this.handleAddActionInput} />
                      <button className="md-btn-square md-btn-minus posR" onClick={this.handleRemoveActionInput} />
                    </div>
                  </div>
                </div>
                <div className="md-form-group">
                  <label>タスク</label>
                  <ul className="form-list">
                    {console.log(this.state, 'state')}
                    {currentTasks.map((t, i) => {
                      console.log(t, i)
                      return (
                        <div className="task-checkbox-wrap" key={i}>
                          <label className="task-checkbox">
                            <input
                              type="checkbox"
                              name="task"
                              value={t.task}
                              checked={t.check}
                              onChange={this.handleCheck.bind(this, t.id)}
                            />
                            <span className="md-icon md-icon-checkbox" />
                            <span className="md-text md-task-name">
                              {t.task}
                            </span>
                          </label>
                        </div>
                      )
                    })}
                  </ul>
                  <div className="md-form-item md-item-add--task">
                    <div className="report-add-task">
                      <input
                        type="text"
                        name="task"
                        placeholder="デザイン構築"
                        className="md-form-input"
                        onChange={this.handleAddTask}
                        onBlur={this.handleAddTask}
                      />
                      <button className="md-btn-square md-btn-plus posR" onClick={this.handleAddTaskInput} />
                      <button className="md-btn-square md-btn-minus posR" onClick={this.handleRemoveTaskInput} />
                    </div>
                  </div>
                </div>
                <div className="md-form-group">
                  <label>行動履歴</label>
                  <div className="md-log-item">
                    <div className="log-view-wrap">
                    {isEmpty(currentLogs) === false ? 
                      currentLogs.map((l, i) => {
                        return (
                          <div className="log-view-box" key={i}>
                            <p className="md-time">
                              <span className="md-time--start">{l.start}</span>
                              <span className="md-time--span">〜</span>
                              <span className="md-time--end">{l.end}</span>
                            </p>
                            <p className="md-log">{l.log}</p>
                            <p className="md-cause">{l.cause}</p>
                            <p className="md-retro">{l.retro}</p>
                          </div>
                        )
                      })
                    : null}
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
                    <div className="log-add-wrap">
                      <div className="createNew-log-view">
                        <div className="createNew-log-view-inner">
                          <h5 className="md-title md-title-h5">
                            <img src={edit} alt="" className="md-icon md-icon-editIcon" />
                            編集中
                          </h5>
                          <p className="md-time">
                            <img src={time} alt="" className="md-icon md-icon-time" />
                            <span className="md-time--start">{this.state.inputStart}</span>
                            <span className="md-time--span">〜</span>
                            <span className="md-time--end">{this.state.inputEnd}</span>
                          </p>
                          <p className="md-log">{this.state.inputLog}</p>
                          <p className="md-cause"><img src={cause} alt="" className="md-icon md-icon-cause" />{this.state.inputCause}</p>
                          <p className="md-retro"><img src={analysis} alt="" className="md-icon md-icon-analysis" />{this.state.inputRetro}</p>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="log"
                        placeholder="朝会"
                        className="md-form-input md-form-input--log"
                        onChange={this.handleAddLog}
                        onBlur={this.handleResetLogInput}
                      />
                      <div className="input-log-item">
                        <h4 className="md-title md-title-h4">行動理由</h4>
                        <textarea
                          name="cause"
                          placeholder="dockerに新しいコンテナを立てる必要がある為"
                          onChange={this.handleAddCause}
                          onBlur={this.handleResetCauseTextArea}
                        />
                      </div>
                      <div className="input-log-item">
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
                  {(() => {
                    if (currentNextActions) {
                      <ul className="form-list">
                        {currentNextActions.map((n, i) => {
                          return (
                            <li className="form-item" key={i}>
                              <span className="form-item-name">{n}</span>
                              <button className="md-btn-square md-btn-minus posR" onClick={this.handleRemoveNextActInput} />
                            </li>
                          )
                        })}
                      </ul>
                    }
                  })()}
                  <div className="md-form-item md-form-item--next">
                    <div className="report-add-next">
                      <input
                        type="text"
                        name="action"
                        placeholder="コードレビューを丁寧に進める"
                        className="md-form-input md-form-input--next"
                        onChange={this.handleNextAction}
                        onBlur={this.handleNextAction}
                      />
                      <button className="md-btn-square md-btn-plus posR" onClick={this.handleAddNextActInput} />
                    </div>
                  </div>
                </div>
                <div className="report-setBtn-wrap">
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

export default withRouter(EditReport)
