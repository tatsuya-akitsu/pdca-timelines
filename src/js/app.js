import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Main from './components/main';
import Signup from './components/signup';
import Signin from './components/signin';
import Dashboard from './components/dashboard';
import Reports from './components/reports';
import AddReport from './components/addReport';
import EditReport from './components/editReport';
import ReportDetail from './components/reportDetail';
import Mypage from './components/mypage';
import EditMypage from './components/editMypage';
import Config from './components/config'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/reports" component={Reports} />
          <Route path="/reports/report/add" component={AddReport} />
          <Route path="/reports/report/:reportId/edit" component={EditReport} />
          <Route path="/reports/report/:reportId" component={ReportDetail} />
          <Route path="/mypage/:uid" component={Mypage} />
          <Route path="/mypage/:uid/edit" component={EditMypage} />
          <Route path="/settings/:uid" component={Config} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
