import React, { FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { useState } from 'react'
import {v4 as uuid} from 'uuid'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'

interface DetailParams {
    id: string
}

 const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
     
    const activityStore = useContext(ActivityStore);
    const {
        createActivity, 
        editActivity, 
        submitting, 
        cancelFormOpen, 
        activity: initializeFormState, 
        loadActivity, 
        loadingInitial,
        clearActivity
    } = activityStore;

    useEffect(() => {
        if(match.params.id){
            loadActivity(match.params.id).then(
                () => initializeFormState && setActivity(initializeFormState)
            );
        }
        return () => {
            clearActivity()
        }
        
    },[loadActivity, match.params.id, clearActivity, initializeFormState])


    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    });

    const handleSubmit =  () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
             createActivity(newActivity)
         
        } else {
             editActivity(activity)
           
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value })

    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} placeholder='Title' value={activity.title} name='title' />
                <Form.TextArea onChange={handleInputChange} rows={2} placeholder='Description' name='description' value={activity.description} />
                <Form.Input onChange={handleInputChange} placeholder='Category' name='category' value={activity.category} />
                <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' name='date' value={activity.date} />
                <Form.Input onChange={handleInputChange} placeholder='City' name='city' value={activity.city} />
                <Form.Input onChange={handleInputChange} placeholder='Venue' name='venue' value={activity.venue} />
                <Button  loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' type='button' content='Cancel' onClick={()=>{ history.push(`/activities/${activity.id}`)}} />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm)