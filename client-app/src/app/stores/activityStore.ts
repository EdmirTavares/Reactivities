import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import { IActivity } from '../models/activity'
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';

configure({ enforceActions: 'always' })

class ActivityStore {
    @observable activitiesRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activitiesRegistry.values()));
    }
    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date!.getTime() - b.date!.getTime()
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true
        try {
            const activities = await agent.Activities.list()
            runInAction('loading activities', () => {
                activities.forEach((activity) => {
                    activity.date = new Date(activity.date)
                    this.activitiesRegistry.set(activity.id, activity)
                })
                this.loadingInitial = false
            })
        } catch (error) {
            runInAction('loading activities error', () => {
                this.loadingInitial = false
            })
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await await agent.Activities.details(id)
                runInAction('getting activity', () => {
                    activity.date = new Date(activity.date)
                    this.activity = activity;
                    this.activitiesRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction('get activity  error', () => {
                    this.loadingInitial = false;
                })
                console.log(error)
            }
        }
        return activity
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activitiesRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activitiesRegistry.set(activity.id, activity)
                this.submitting = false
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction('creating activity error', () => { this.submitting = false })
            toast.error('Problem submitting data')
            console.log(error.response);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity)
            runInAction('editing activity', () => {
                this.activitiesRegistry.set(activity.id, activity)
                this.activity = activity;
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction('editing activity error', () => { this.submitting = false; })
            toast.error('Problem submitting data')
            console.log(error.response)
        }
    }

    @action deleteActivity = async (id: string, event: SyntheticEvent<HTMLButtonElement>) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id)
            runInAction('deleting activity', () => {
                this.activitiesRegistry.delete(id)
                this.submitting = false
                this.target = ''
            })

        } catch (error) {
            runInAction('deleting activity error', () => { this.submitting = false })

            console.log(error)
        }
    }


}

export default createContext(new ActivityStore())


