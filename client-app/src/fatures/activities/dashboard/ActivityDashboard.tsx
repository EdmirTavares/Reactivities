import React, { SyntheticEvent } from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { ActivityList } from './ActivityList'
import { ActivityDetails } from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'

interface IProps {
    activities: IActivity[]
    selectActivity: (id: string) => void
    selectedActivity: IActivity | null
    editMode: boolean
    setEditMode: (mode: boolean) => void
    setselectedActivity: (activity: IActivity | null) => void
    createActivity: (activity: IActivity) => void
    editActivity: (activity: IActivity) => void,
    deleteActivity:(event: SyntheticEvent<HTMLButtonElement>, id: string) => void,
    submiting: boolean,
    target: string
}



export const ActivityDashboard: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    editMode,
    setEditMode,
    setselectedActivity,
    createActivity,
    editActivity,
    deleteActivity,
    submiting,
    target
}) => {

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submiting={submiting}
                    target={target}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        setEditMode={setEditMode}
                        setselectedActivity={setselectedActivity}                        
                    />
                }
                {editMode &&
                    <ActivityForm // eslint-disable-next-line
                        key={selectedActivity && selectedActivity.id || 0}  
                        setEditMode={setEditMode}
                        activity={selectedActivity}
                        createActivity={createActivity}
                        editActivity={editActivity}
                        submiting={submiting}
                        // target={target}
                    />
                }
            </Grid.Column>
        </Grid>
    )
}
