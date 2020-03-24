import React, { FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { useState } from 'react'
import {v4 as uuid} from 'uuid'


interface IProps {
    setEditMode: (mode: boolean) => void,
    activity: IActivity | null,
    createActivity: (activity: IActivity) => void,
    editActivity: (activity: IActivity) => void,
    submiting: boolean
}


export const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initializeFormState,
    createActivity,
    editActivity,
    submiting
}) => {

    const initializeForm = () => {
        if (initializeFormState) {
            return initializeFormState;
        }
        else {
            return {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    }
    const [activity, setActivity] = useState(initializeForm);

    const handleSubmit = () => {
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
                <Button  loading={submiting} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' type='button' content='Cancel' onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
}
