import { configureStore } from '@reduxjs/toolkit';

import { loaderSlice } from './loader-slice.jsx';
import modalSlice from './modal-slice.jsx';
import QuestionFormSlice from './question-form-slice.jsx';
export const store = configureStore({
	reducer: {
		loader: loaderSlice.reducer,
		modal: modalSlice.reducer,
		questionForm: QuestionFormSlice.reducer,
	},
});
