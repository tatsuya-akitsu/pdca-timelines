import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';

import Main from './components/main';
import Signup from './components/signup';
import Signin from './components/signin';
import Dashboard from './components/dashboard';
import Reports from './components/reports';
import AddReport from './components/addReport';
import EditReport from './components/editReport';
import ReportDetail from './components/reportDetail';
// import Dissections from './components/dissections';
// import Dissection from './components/dissection';
import Mypage from './components/mypage';
import EditMypage from './components/editMypage';
// import Config from './components/config';
// import Terms from './components/terms';
// import Policy from './components/policy';
// import NotFound from './components/notFound';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route exact path="/" component={Main} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/dashboard/:uid" component={Dashboard} />
        <Route path="/reports" component={Reports} />
        <Route path="/reports/report/add" component={AddReport} />
        <Route path="/reports/report/:reportId/edit" component={EditReport} />
        <Route path="/reports/report/:reportId" component={ReportDetail} />
        <Route path="/mypage/:uid" component={Mypage} />
        <Route path="/mypage/:uid/edit" component={EditMypage} />
        {/* <Route path="/dissections" component={Dissections} />
        <Route path="/dissections/dissection/:dissectionId" component={Dissection} /> */}
        {/* <Route path="/room/:roomId" component={Room} /> */}
      </Router>
    );
  }
}

export default App;
