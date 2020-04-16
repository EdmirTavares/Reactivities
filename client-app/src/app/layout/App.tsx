import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar  from '../../fatures/nav/NavBar';
import ActivityDashboard from '../../fatures/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite'
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from '../../fatures/home/HomePage';
import ActivityForm from '../../fatures/activities/form/ActivityForm';
import ActivityDetails from '../../fatures/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({location}) => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore]);

  if(activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/activities' component={ActivityDashboard} />
        <Route exact path='/activities/:id' component={ActivityDetails} />
        <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm} />
      </Container>
    </Fragment>

  );

}

export default withRouter(observer(App));
