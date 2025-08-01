import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { loaderActions } from './loader-slice.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

let initialState = {
    data: {
        post_id: null,
        subject_id: null,
        topic_id: null,
        pub_name: null,
        book_name: null,
        pg_no: null,
        mqs_question: null,
        mqs_opt_one: null,
        mqs_opt_two: null,
        mqs_opt_three: null,
        mqs_opt_four: null,
        mqs_opt_five: null,
        mqs_ans: null,
        mqs_solution: null,
        difficulty: null,
        month: null,
        year: [],
        showOptionE: false,
    },
    questionsList: [],
    publicationsList: [],
    bookNamesList: [],
    postsList: [],
    subjectsList: [],
    topicsList: [],
    questionNumber: null,
    errors: {},
    isEdit: false,
    isQuestionPreview: false,
};
const QuestionFormSlice = createSlice({
    name: 'question-form-slice',
    initialState,
    reducers: {
        // question preview
        toggleQuestionPreview(state, action) {
            state.isQuestionPreview = !state.isQuestionPreview;
        },

        toggleShowOptionE(state, action) {
            state.data.showOptionE = !state.data.showOptionE;
        },

        handleInputChange(state, action) {
            let { key, value } = action.payload;
            state.data[key] = value;
        },

        setQuestionsList(state, action) {
            console.log('Info: updating state');
            state.questionsList = action.payload;
            console.log('Info: updated state');
        },

        resetFormData(state, action) {
            state.data.pg_no = null;
            state.data.mqs_question = null;
            state.data.mqs_opt_one = null;
            state.data.mqs_opt_two = null;
            state.data.mqs_opt_three = null;
            state.data.mqs_opt_four = null;
            state.data.mqs_opt_five = null;
            state.data.mqs_ans = null;
            state.data.mqs_solution = null;
            state.data.difficulty = null;
            state.data.month = null;
            state.data.year = [];
        },

        setPublicationsList(state, action) {
            state.publicationsList = action.payload;
        },

        setBooksList(state, action) {
            state.bookNamesList = action.payload;
        },

        setPostsList(state, action) {
            // state.data.subject_id = null;
            // state.data.topic_id = null;
            state.postsList = action.payload;
        },

        setSubjectsList(state, action) {
            console.log(action.payload, 'subjects list');
            let _subjectsList = action.payload;
            if (_subjectsList.length === 0) {
                state.data.topic_id = null;
                state.topicsList = [];
            }

            state.subjectsList = _subjectsList;
        },

        setTopicsList(state, action) {
            state.topicsList = action.payload;
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

export const getQuestionNumberThunk = () => {
    return async (dispatch) => {
        let response = await fetch(SERVER_IP + '/api/questions/get-question-number', {
            credentials: 'include',
        });
        let { data } = await response.json();
        dispatch(QuestionFormActions.setQuestionNumber(data.total_questions));
    };
};

export const getBooksListThunk = (pubName, sendRequest) => {
    return async (dispatch) => {
        let requestData = {
            url: SERVER_IP + '/api/questions/books-list',
            method: 'POST',
            body: JSON.stringify({ pubName: pubName }),
        };
        sendRequest(requestData, ({ success, data }) => {
            if (data.length == 0) {
                dispatch(QuestionFormActions.setBooksList([]));
            } else {
                dispatch(QuestionFormActions.setBooksList(data));
            }
        });
    };
};

export const getPublicationsListThunk = (sendRequest) => {
    return async (dispatch) => {
        let requestData = {
            url: SERVER_IP + '/api/questions/publications-list',
        };
        sendRequest(requestData, ({ success, data }) => {
            if (data.length == 0) {
                dispatch(QuestionFormActions.setPublicationsList([]));
            } else {
                dispatch(QuestionFormActions.setPublicationsList(data));
            }
        });
    };
};

export const getPostListThunk = (sendRequest) => {
    console.log(typeof import.meta.env.VITE_API_IP, '==import.env.==');
    console.log(import.meta.env.VITE_API_IP, '==import.env.==');
    return async (dispatch) => {
        try {
            dispatch(loaderActions.showLoader());

            const requestData = {
                url: SERVER_IP + '/api/posts/list',
            };
            sendRequest(requestData, ({ success, data }) => {
                if (success === 1) {
                    console.log(data, '=================================');
                    dispatch(QuestionFormActions.setPostsList(data));
                }
            });
        } catch (error) {
            console.log(error);
            toast('Error getting questions list');
        } finally {
            dispatch(loaderActions.hideLoader());
        }
    };
};

export const getSubjectsListThunk = (post_id, sendRequest) => {
    return async (dispatch) => {
        const reqData = {
            url: SERVER_IP + '/api/subject/list',
            method: 'POST',
            body: JSON.stringify({ post_id }),
        };

        if (!post_id) {
            console.warn('No post id passed to get subject list');
            dispatch(QuestionFormActions.setSubjectsList([]));
        } else {
            sendRequest(reqData, ({ data, success }) => {
                if (success == 1) {
                    dispatch(QuestionFormActions.setSubjectsList(data));
                }
            });
        }
    };
};

export const getTopicsListThunk = (subject_id, sendRequest) => {
    return async (dispatch) => {
        const requestData = {
            url: SERVER_IP + '/api/topic/list',
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

export const getEditQuestionDetailsThunk = (questionId, sendRequest, post_id) => {
    return async (dispatch) => {
        let requestData = {
            url: SERVER_IP + '/api/questions/edit-question-data',
            method: 'POST',
            body: JSON.stringify({ questionId }),
        };

        sendRequest(requestData, ({ data }) => {
            data[0]['post_id'] = post_id;
            console.log(data[0], 'edit question data');
            dispatch(QuestionFormActions.setEditQuestionDetails(data[0]));
        });
    };
};

export const QuestionFormActions = QuestionFormSlice.actions;
export default QuestionFormSlice;
