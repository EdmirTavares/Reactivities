import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../fatures/nav/NavBar';
import { ActivityDashboard } from '../../fatures/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';



const App = () => {

  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setselectedActivity] = useState<IActivity | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [loadibg, setLoadibg] = useState(true)
  const [submiting, setSubmiting] = useState(false)
  const [target, setTarget] = useState('')


  const handleSelectActivity = (id: string) => {
    setselectedActivity(activities.filter(a => a.id === id)[0])
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setselectedActivity(null);
    setEditMode(true);
  }
  const handleCreateActivity = (activity: IActivity) => {
    setSubmiting(true)
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setselectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmiting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmiting(true)
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setselectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmiting(false));;
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmiting(true)
    setTarget(event.currentTarget.name)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)])
    }).then(() => setSubmiting(false));;
  }

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = []

        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0]
          activities.push(activity)
        })
        setActivities(activities)
      }).then(() => {
        setLoadibg(false)
      });
  }, []);


  if(loadibg) return <LoadingComponent content='Loading activities...' />

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setselectedActivity={setselectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submiting={submiting}
          target={target}
        />
      </Container>
    </Fragment>

  );

}

export default App;
