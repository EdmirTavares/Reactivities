import React, { useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import { category } from '../../../app/common/options/categoryOptions'
import DateInput from '../../../app/common/form/DateInput'
import { combineDateAndTime } from '../../../app/common/util/util'
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore'

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 caracters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
})

interface DetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const rootStore = useContext(RootStoreContext);
    const {
        createActivity,
        editActivity,
        submitting,
        loadActivity,
    } = rootStore.activityStore;



    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then(
                (activity) => setActivity(new ActivityFormValues(activity))
            ).finally(()=> setLoading(false));
        }

    }, [loadActivity, match.params.id])
    
    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime; 
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);

        } else {
            editActivity(activity);
        }
    }
  
    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form loading={loading} onSubmit={handleSubmit}>
                                <Field
                                    placeholder='Title'
                                    value={activity.title}
                                    name='title'
                                    component={TextInput} />
                                <Field
                                    rows={3}
                                    placeholder='Description'
                                    name='description'
                                    value={activity.description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    placeholder='Category'
                                    name='category'
                                    value={activity.category}
                                    component={SelectInput}
                                    options={category}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        placeholder='Date'
                                        name='date'
                                        date={true}
                                        value={activity.date}
                                        component={DateInput}
                                    />
                                    <Field
                                        placeholder='time'
                                        name='time'
                                        time={true}
                                        value={activity.date}
                                        component={DateInput}
                                    />
                                </Form.Group>                                
                                <Field 
                                    placeholder='City' 
                                    name='city' 
                                    value={activity.city} 
                                    component={TextInput}
                                    />
                                <Field 
                                    placeholder='Venue' 
                                    name='venue' 
                                    value={activity.venue} 
                                    component={TextInput}
                                    />
                                <Button 
                                    loading={submitting} 
                                    floated='right' 
                                    positive 
                                    type='submit' 
                                    content='Submit' 
                                    disabled={loading || invalid || pristine}
                                    />
                                <Button 
                                    disabled={loading}
                                    floated='right' 
                                    type='button' 
                                    content='Cancel' 
                                    onClick={ 
                                        activity.id 
                                            ? () => history.push(`/activities/${activity.id}`) 
                                            : () => history.push('/activities') 
                                    } 
                                    />
                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm)