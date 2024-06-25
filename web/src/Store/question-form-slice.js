import { createSlice } from '@reduxjs/toolkit';
import { notificationActions } from './notification-slice.js';
import useHttp from '../components/Hooks/use-http.js';
import { loaderActions } from './loader-slice.js';

let initialState = {
	data: {
		subject_id: null,
		topic_id: null,
		question_content: null,
		option_A: null,
		option_B: null,
		option_C: null,
		option_D: null,
		option_E: null,
		correct_option: null,
		explanation: null,
		pub_name: null,
		pg_no: null,
	},
	subjectsList: [],
	topicsList: [],
	questionNumber: null,
};
const QuestionFormSlice = createSlice({
	name: 'question-form-slice',
	initialState,
	reducers: {
		handleInputChange(state, action) {
			let { key, value } = action.payload;
			console.log(key, value, '==key,value==');
			state.data[key] = value;
		},

		setSubjectsList(state, action) {
			let subjects = action.payload;
			state.subjectsList = subjects;
		},

		setTopicsList(state, action) {
			let topics = action.payload;
			state.topicsList = topics;
		},

		setQuestionNumber(state, action) {
			state.questionNumber = action.payload;
		},
	},
});

export const getSubjectsListThunk = () => {
	return async (dispatch) => {
		try {
			dispatch(loaderActions.showLoader());
			let response = await fetch('/get-subject-list');
			let { success, data } = await response.json();

			if (success === 1) {
				dispatch(QuestionFormActions.setSubjectsList(data[0]));
			}
		} catch (error) {
			dispatch(loaderActions.hideLoader());
			dispatch(
				notificationActions.showNotification('Error getting questions list')
			);
		}
	};
};

export const getTopicsListThunk = (subject_id, sendRequest) => {
	return async (dispatch) => {
		const requestData = {
			url: '/get-topic-list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId: subject_id }),
		};
		sendRequest(requestData, (data) => {
			dispatch(QuestionFormActions.setTopicsList(data.data));
		});
	};
};

export const QuestionFormActions = QuestionFormSlice.actions;
export default QuestionFormSlice;
