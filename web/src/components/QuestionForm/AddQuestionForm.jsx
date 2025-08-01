import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    QuestionFormActions,
    getBooksListThunk,
    getPostListThunk,
    getPublicationsListThunk,
    getQuestionNumberThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import AddBookModal from './AddBook/AddBookModal.jsx';
import AddPostModal from './AddPost/AddPostModal.jsx';
import AddPublicationModal from './AddPublication/AddPublicationModal.jsx';
import AddSubjectModal from './AddSubject/AddSubjectModal.jsx';
import AddTopicFormModal from './AddTopic/AddTopicModal.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import ExplanationInput from './ExplanationInput.jsx';
import OptionsInput from './OptionsInput.jsx';
import PostListDropdown from './PostListDropdown/PostListDropdown.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionPreview from './QuestionPreview/QuestionPreview.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';
import SubjectListDropdown from './SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from './TopicListDropdown/TopicListDropdown.jsx';
import addQuestionFormSchema from './addQuestionFormSchema.jsx';
import { getCookie, resetCkEditorInstances } from '../utils/utils.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

const AddQuestionForm = () => {
    const dispatch = useDispatch();
    const { sendRequest } = useHttp();
    let { data: _formData, questionNumber, errors } = useSelector((state) => state.questionForm);
    console.log(_formData);

    useEffect(() => {
        dispatch(getQuestionNumberThunk());
        dispatch(getPostListThunk(sendRequest));
        dispatch(getPublicationsListThunk(sendRequest));
    }, []);

    useEffect(() => {
        dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
    }, [_formData.post_id]);

    useEffect(() => {
        dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
    }, [_formData.subject_id]);

    useEffect(() => {
        dispatch(getBooksListThunk(_formData.pub_name, sendRequest));
    }, [_formData.pub_name]);

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        try {
            await addQuestionFormSchema.validate(_formData, { abortEarly: false });
            postQuestionData();

            dispatch(QuestionFormActions.setErrors({}));
        } catch (error) {
            const errorsObj = {};
            error.inner.forEach((el) => {
                errorsObj[el.path] = el.message;
            });
            dispatch(QuestionFormActions.setErrors(errorsObj));
        }
    };

    async function postQuestionData() {
        if (!_formData.userId) {
            // This is only if the userid is not added in redux state when app initially starts
            _formData.userId = getCookie('userId');
        }
        let reqData = {
            url: SERVER_IP + '/api/questions/add-question',
            method: 'POST',
            body: JSON.stringify(_formData),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                toast('Successfully added question');
                Swal.fire({
                    title: 'Success',
                    text: 'Successfully saved question',
                });
                dispatch(QuestionFormActions.resetFormData());
                resetCkEditorInstances();
                dispatch(QuestionFormActions.setQuestionNumber(questionNumber));
            }
        });
    }

    // useEffect(() => {
    // 	return () => {
    // 		let isConfirm = confirm('Do you want to leave');
    // 		if (!isConfirm) return false;
    // 	};
    // }, []);

    return (
        <div className="">
            <AddPostModal />
            <AddSubjectModal />
            <AddTopicFormModal />
            <AddPublicationModal />
            <AddBookModal />

            <form
                id="add-question-form"
                className="grid grid-cols-1 md:grid-cols-2 gap-5 ms-5"
                onSubmit={handleSaveQuestion}>
                <div>
                    <div className={`bg-white pb-2 sticky top-0 z-30 shadow-md my-2`}>
                        <div className="grid grid-cols-3 gap-y-2 gap-x-2">
                            <PostListDropdown />
                            <SubjectListDropdown />
                            <TopicListDropdown />
                            <DifficultyLevelDropdown />

                            <PublicationNameDropdown />
                            <BookNameDropdown />
                            <QuestionPgNo />
                            {/* <QuestionMonthDropdown /> */}
                            <QuestionYearDropdown />
                        </div>
                    </div>
                    <OptionsInput />

                    <OptionsDropdown />

                    <hr />

                    <ExplanationInput />

                    <div className="flex items-center justify-center flex-col">
                        {Object.values(errors).length > 0 && (
                            <p className="error text-center mt-4">
                                Some errors are there in form please check{' '}
                            </p>
                        )}

                        <div className="flex justify-end m-3">
                            <CButton
                                className="flex justify-center items-center text-2xl"
                                type="submit"
                                isLoading={useSelector((state) => state.loader.isLoading)}>
                                Save
                            </CButton>
                        </div>
                    </div>
                </div>

                <QuestionPreview />
            </form>
        </div>
    );
};

export function OptionsDropdown() {
    const dispatch = useDispatch();
    const { data: _formData, errors } = useSelector((state) => state.questionForm);
    const handleOptionChange = (e) => {
        dispatch(
            QuestionFormActions.handleInputChange({
                key: e.target.name,
                value: e.target.value,
            })
        );
    };
    return (
        <>
            <div className="flex flex-col gap-3 relative w-fit">
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="mqs_opt_three"
                        className="input-label question-option !top-[-3rem]">
                        Correct Option
                    </label>
                    <select
                        id="post-id"
                        className="input-el grow w-48"
                        name="mqs_ans"
                        onChange={handleOptionChange}>
                        <option value="" className="" name="">
                            -- Select --
                        </option>
                        <option value={'A'} selected={_formData.mqs_ans == 'A' ? true : false}>
                            A
                        </option>
                        <option value={'B'} selected={_formData.mqs_ans == 'B' ? true : false}>
                            B
                        </option>
                        <option value={'C'} selected={_formData.mqs_ans == 'C' ? true : false}>
                            C
                        </option>
                        <option value={'D'} selected={_formData.mqs_ans == 'D' ? true : false}>
                            D
                        </option>
                        {_formData.showOptionE && (
                            <option value={'E'} selected={_formData.mqs_ans == 'E' ? true : false}>
                                E
                            </option>
                        )}
                    </select>
                </div>
                {errors.mqs_ans && <div className="error">{errors.mqs_ans}</div>}
            </div>
        </>
    );
}

export default AddQuestionForm;
