import { useEffect, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import QuestionPreview from './QuestionPreview/QuestionPreview.jsx';

import { QuestionFormActions } from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import ExplanationInput from './ExplanationInput.jsx';

import { FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { OptionsDropdown } from './AddQuestionForm.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import EditOptionsInput from './EditOptionsInput.jsx';
import editQuestionFormSchema from './editQuestionFormSchema.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

const EditQuestionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();
    let { data: _formData, isEdit } = useSelector((state) => state.questionForm);

    const questionsList = useSelector((state) => state.questionForm.questionsList);

    useLayoutEffect(() => {
        if (!isEdit) {
            navigate('/questions-list');
        }
    }, [isEdit]);

    useEffect(() => {
        return () => {
            dispatch(QuestionFormActions.setEditingFalse());
            dispatch(QuestionFormActions.resetFormData());
        };
    }, []);

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            await editQuestionFormSchema.validate(_formData, { abortEarly: false });
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
        let reqData = {
            url: SERVER_IP + '/api/questions/update-question',
            method: 'PUT',
            body: JSON.stringify(_formData),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                toast('Question has been updated.');
                updateQuestionInReduxState(_formData);
                setTimeout(() => {
                    dispatch(QuestionFormActions.setEditingFalse());
                }, 1);
            }
        });
    }

    function updateQuestionInReduxState(_formData) {
        let editedQuestionIndex = questionsList.findIndex((_q) => _q.id == _formData.id);
        if (editedQuestionIndex !== -1) {
            let updatedData = [...questionsList];
            updatedData[editedQuestionIndex] = { ..._formData };
            dispatch(QuestionFormActions.setQuestionsList(updatedData));
        }
    }

    function resetCkEditorInstances() {
        if (window.CKEDITOR && window.CKEDITOR.instances) {
            if (window.CKEDITOR.instances[`mqs_question`]) window.CKEDITOR.instances[`mqs_question`].setData('');
            if (window.CKEDITOR.instances[`mqs_opt_one`]) window.CKEDITOR.instances[`mqs_opt_one`].setData('');
            if (window.CKEDITOR.instances[`mqs_opt_two`]) window.CKEDITOR.instances[`mqs_opt_two`].setData('');
            if (window.CKEDITOR.instances[`mqs_opt_three`]) window.CKEDITOR.instances[`mqs_opt_three`].setData('');
            if (window.CKEDITOR.instances[`mqs_opt_four`]) window.CKEDITOR.instances[`mqs_opt_four`].setData('');
            if (window.CKEDITOR.instances[`mqs_opt_five`]) window.CKEDITOR.instances[`mqs_opt_five`].setData('');
            if (window.CKEDITOR.instances[`mqs_solution`]) window.CKEDITOR.instances[`mqs_solution`].setData('');
        }
    }

    return (
        <div className="bg-gray-50/50 pb-10">
            <div className="container mx-auto sticky top-0 bg-white z-50"></div>

            <form
                id="edit-question-form"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-screen-2xl mx-auto"
                onSubmit={handleUpdateQuestion}>

                {/* Left Column - Form Controls */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* Sticky Metadata Header */}
                    <div className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border border-gray-100 rounded-xl shadow-sm p-5 transition-all min-h-[240px]">
                        <div className="mb-4 pb-2 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 flex flex-wrap items-center gap-2">
                                Edit data for <FaAngleRight className="text-gray-400" />
                                <span className="underline decoration-indigo-200">Post Name</span>
                                <FaAngleDoubleRight className="text-gray-400" />
                                <span className="underline decoration-indigo-200">{_formData.subject_name}</span>
                                <FaAngleDoubleRight className="text-gray-400" />
                                <span className="underline decoration-indigo-200">{_formData.topic_name}</span>
                            </h2>
                        </div>

                        <div className="flex justify-end mb-4 text-sm text-gray-600 font-medium">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded mx-1 border border-indigo-100">{_formData.pub_name}</span>
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded mx-1 border border-indigo-100">{_formData.book_name}</span>
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded mx-1 border border-indigo-100">Pg. {_formData.pg_no}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4">
                            <DifficultyLevelDropdown />
                            <PublicationNameDropdown isShowAddNewBtn={false} />
                            <BookNameDropdown />
                            <QuestionPgNo />
                            <QuestionYearDropdown />
                        </div>
                    </div>

                    {/* Question and Options Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <EditOptionsInput />

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <OptionsDropdown />
                        </div>
                    </div>

                    {/* Explanation Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <ExplanationInput />
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:sticky lg:top-0 h-fit lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[240px]">
                        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
                        </div>
                        <div className="p-5">
                            <QuestionPreview />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="fixed bottom-6 right-6 z-40">
                    <CButton
                        className="flex justify-center items-center text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                        type="submit"
                        isLoading={useSelector((state) => state.loader.isLoading)}>
                        Update Question
                    </CButton>
                </div>
            </form>
        </div>
    );
};

export default EditQuestionForm;
