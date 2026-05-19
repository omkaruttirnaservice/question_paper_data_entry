import React, { useEffect, useState } from 'react';
import { FaAngleDoubleRight, FaEyeSlash } from 'react-icons/fa';
import { FaAngleRight, FaEye } from 'react-icons/fa6';

import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.jsx';
import CButton from '../../UI/CButton.jsx';

function QuestionPreview() {
    const dispatch = useDispatch();

    const [dataEntryFor, setDataEntryFor] = useState({
        postName: null,
        subjectName: null,
        topicName: null,
    });

    const {
        data: _formData,
        isQuestionPreview,
        postsList,
        subjectsList,
        topicsList,
        questionNumber,
    } = useSelector((state) => state.questionForm);

    useEffect(() => {
        if (isQuestionPreview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isQuestionPreview]);

    useEffect(() => {
        if (_formData.post_id) {
            let postDetails = postsList.find((post) => post.id == _formData.post_id);
            let subjectDetails = subjectsList.find((sub) => sub.id == _formData.subject_id);
            let topicDetails = topicsList.find((topic) => topic.id == _formData.topic_id);

            setDataEntryFor({
                postName: postDetails?.mtl_test_name || '',
                subjectName: subjectDetails?.mtl_name || '',
                topicName: topicDetails?.topic_name || '',
            });
        }
    }, [_formData.post_id, _formData.subject_id, _formData.topic_id]);

    const handleKeyPress = (e) => {
        let key = e.key;
        if (e.altKey && key.toLowerCase() == 'p') {
            dispatch(QuestionFormActions.toggleQuestionPreview());
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div className="text-gray-700 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2 custom-scrollbar">
            {/* Metadata Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="text-gray-400 uppercase tracking-wider text-[10px]">Path</span>
                <FaAngleRight className="text-gray-300 text-[10px]" />
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{dataEntryFor.postName || 'Post'}</span>
                <FaAngleDoubleRight className="text-gray-300 text-[10px]" />
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{dataEntryFor.subjectName || 'Subject'}</span>
                <FaAngleDoubleRight className="text-gray-300 text-[10px]" />
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">{dataEntryFor.topicName || 'Topic'}</span>
            </div>

            {/* Source Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{_formData.pub_name || 'Publication'}</span>
                <span className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{_formData.book_name || 'Book'}</span>
                <span className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 text-gray-500">Pg. {_formData.pg_no || '-'}</span>
            </div>

            {/* Content Preview */}
            <div className="flex flex-col gap-4 mt-2">
                <PreviewOptionContainer
                    title={`Question-${questionNumber}`}
                    html={_formData.mqs_question}
                    isQuestion={true}
                />

                <div className="pl-3 border-l-2 border-gray-100 flex flex-col gap-3">
                    <PreviewOptionContainer title={`A`} html={_formData.mqs_opt_one} />
                    <PreviewOptionContainer title={`B`} html={_formData.mqs_opt_two} />
                    <PreviewOptionContainer title={`C`} html={_formData.mqs_opt_three} />
                    <PreviewOptionContainer title={`D`} html={_formData.mqs_opt_four} />
                    
                    {_formData.mqs_opt_five && (
                        <PreviewOptionContainer title={`E`} html={_formData.mqs_opt_five} />
                    )}
                </div>

                <div className="mt-2 flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                    <span className="text-sm font-semibold text-green-800">Correct Option</span>
                    <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-sm">
                        {_formData.mqs_ans || '-'}
                    </span>
                </div>

                <div className="mt-2">
                    <PreviewOptionContainer title={`Explanation`} html={_formData.mqs_solution} isExplanation={true} />
                </div>
            </div>
        </div>
    );
}

function PreviewOptionContainer({ title, html, isQuestion, isExplanation }) {
    if (!html) return null;
    
    return (
        <div className={`flex flex-col gap-1 ${isQuestion ? 'mb-2' : ''}`}>
            <span className={`text-xs font-bold ${isQuestion ? 'text-indigo-600 uppercase tracking-wider' : isExplanation ? 'text-amber-600 uppercase tracking-wider' : 'text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full'}`}>
                {title}
            </span>
            <div
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
                className={`text-sm ${isQuestion ? 'text-gray-800 font-medium' : 'text-gray-600'} bg-white border border-gray-100 rounded-md p-3 shadow-sm min-h-[40px] break-words prose prose-sm max-w-none prose-p:my-0 prose-headings:my-1 prose-ul:my-0 prose-ol:my-0`}></div>
        </div>
    );
}

export default QuestionPreview;
