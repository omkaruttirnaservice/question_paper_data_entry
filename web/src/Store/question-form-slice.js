import { createSlice } from '@reduxjs/toolkit';
import { loaderActions } from './loader-slice.js';
import { notificationActions } from './notification-slice.js';

let initialState = {
	data: {
		subject_id: null,
		topic_id: null,
		pub_name: null,
		pg_no: null,
		question_content: null,
		option_A: null,
		option_B: null,
		option_C: null,
		option_D: null,
		option_E: null,
		correct_option: null,
		explanation: null,
	},
	subjectsList: [],
	topicsList: [],
	questionNumber: null,
	errors: {},
	isEdit: false,
};
const QuestionFormSlice = createSlice({
	name: 'question-form-slice',
	initialState,
	reducers: {
		handleInputChange(state, action) {
			let { key, value } = action.payload;
			console.log(key, value, '-here in slice');
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
			state.questionNumber = +action.payload + 1;
		},

		setErrors(state, action) {
			state.errors = {};
			state.errors = action.payload;
		},

		setEditQuestionDetails(state, action) {
			state.isEdit = true;
			console.log(action.payload);
			state.data = action.payload;
		},

		setEditingFalse(state, action) {
			state.isEdit = false;
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

			dispatch(loaderActions.hideLoader());
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
		if (!subject_id) {
			dispatch(QuestionFormActions.setTopicsList([]));
		} else {
			sendRequest(requestData, (data) => {
				dispatch(QuestionFormActions.setTopicsList(data.data));
			});
		}
	};
};

// export const getEditQuestionDetailsThunk = (questionId, sendRequest) => {
// 	return async (dispatch) => {
// 		try {
// 			let requestData = {
// 				url: '/questions/edit-question-data',
// 				method: 'POST',
// 				body: JSON.stringify({ questionId }),
// 			};

// 			sendRequest(requestData, ({ data }) => {
// 				dispatch(QuestionFormActions.setEditQuestionDetails(data[0]));
// 			});
// 		} catch (error) {
// 			dispatch(notificationActions.hideLoader());
// 		}
// 	};
// };

export const QuestionFormActions = QuestionFormSlice.actions;
export default QuestionFormSlice;
