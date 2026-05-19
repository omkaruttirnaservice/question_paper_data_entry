import { useEffect, useState } from 'react';
import {
    FaArrowAltCircleLeft,
    FaArrowAltCircleRight,
    FaEdit,
    FaEye,
    FaGripLinesVertical,
    FaListUl,
    FaPrint,
    FaSearch,
    FaSortAmountDown,
    FaSortAmountUp,
    FaThLarge,
    FaFileAlt,
    FaTrash,
    FaTags,
    FaBook,
    FaLayerGroup,
    FaChevronRight,
    FaChevronDown,
} from 'react-icons/fa';

import { FaPencil } from 'react-icons/fa6';
import { HiOutlineViewGrid, HiOutlineViewList, HiOutlineDocumentText } from 'react-icons/hi';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import {
    getEditQuestionDetailsThunk,
    getPostListThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
    QuestionFormActions,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import EditQuestionForm from '../QuestionForm/EditQuestionForm.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import PDFGenerator from '../PDFGenerator.jsx';
import Input from '../UI/Input.jsx';
import { _questionListView } from '../utils/constants.jsx';
function QuestionsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        data: _formData,
        postsList,
        subjectsList,
        topicsList,
        isEdit,
    } = useSelector((state) => state.questionForm);

    const { isLoading } = useSelector((state) => state.loader);
    const questionsList = useSelector((state) => state.questionForm.questionsList);

    const { sendRequest } = useHttp();

    useEffect(() => {
        if (postsList.length === 0) {
            dispatch(getPostListThunk(sendRequest));
        }
    }, []);

    useEffect(() => {
        dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
    }, [_formData.post_id]);

    useEffect(() => {
        dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
    }, [_formData.subject_id]);

    async function getQuestions() {
        let reqData = {
            url: SERVER_IP + '/api/questions/list',
            method: 'POST',
            body: JSON.stringify({
                post_id: _formData.post_id,
                subject_id: _formData.subject_id,
                topic_id: _formData.topic_id,
            }),
        };
        sendRequest(reqData, (data) => {
            dispatch(QuestionFormActions.setQuestionsList(data.data));
        });
    }

    useEffect(() => {
        if (!_formData.topic_id && !_formData.subject_id && !_formData.topic_id) {
            return;
        }
        getQuestions();
    }, [_formData.topic_id]);

    const handleGetQuestionsList = () => getQuestions();

    const handleDeleteQuestion = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This question will move to recycle bin!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmDeleteQuestionTemp(id);
            }
        });
    };

    const confirmDeleteQuestionTemp = (id) => {
        let reqData = {
            url: SERVER_IP + '/api/questions/delete',
            method: 'DELETE',
            body: JSON.stringify({ questionId: id }),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                dispatch(
                    QuestionFormActions.setQuestionsList(questionsList.filter((el) => el.id != id)),
                );
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Question has been moved to recycle bin.',
                    icon: 'success',
                });
            }
        });
    };

    const handleEditQuestion = (id) => {
        dispatch(getEditQuestionDetailsThunk(id, sendRequest, _formData.post_id, _formData.subject_id, _formData.topic_id));
    };

    useEffect(() => {
        if (isEdit) {
            navigate('/edit-question-form');
        }
    }, [isEdit, navigate]);

    const [listMode, setListMode] = useState(_questionListView.LIST);
    const [isAscending, setIsAscending] = useState(true);

    const toggleListMode = (val) => setListMode(val);

    useEffect(() => {
        if (questionsList.length > 0) {
            const sorted = sortQuestionsList(questionsList);
            dispatch(QuestionFormActions.setQuestionsList(sorted));
        }
    }, [isAscending]);

    function sortQuestionsList(questionsList) {
        const updatedList = [...questionsList];
        const n = updatedList.length;

        if (isAscending) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (updatedList[j].id > updatedList[j + 1].id) {
                        let temp = updatedList[j];
                        updatedList[j] = updatedList[j + 1];
                        updatedList[j + 1] = temp;
                    }
                }
            }
        }

        if (!isAscending) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (updatedList[j].id < updatedList[j + 1].id) {
                        let temp = updatedList[j];
                        updatedList[j] = updatedList[j + 1];
                        updatedList[j + 1] = temp;
                    }
                }
            }
        }
        return updatedList;
    }

    return (
        <>
            <CModal id={'view-pdf-modal'} title={'Questions Print List'} className={`min-w-[95vw]`}>
                <PDFGenerator questions={questionsList} />
            </CModal>

            <div className="max-w-[95%] mx-auto mt-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <PostListDropdown isShowAddNewBtn={false} />
                            <SubjectListDropdown isShowAddNewBtn={false} />
                            <TopicListDropdown isShowAddNewBtn={false} />
                        </div>

                        <div className="flex gap-2">
                            <CButton
                                className="h-[42px] px-8 bg-[#4D96FF] hover:bg-[#3B82F6] shadow-lg shadow-blue-200 transition-all duration-300 rounded-full"
                                onClick={handleGetQuestionsList}
                            >
                                <FaSearch className="text-sm" />
                                <span>Search</span>
                            </CButton>

                            <div className="flex items-center bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
                                {/* ASCENDING | DESCENGING FILTERS BUTTON */}
                                <button
                                    title="Toggle Sort Order"
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${isAscending ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200/50'}`}
                                    onClick={() => setIsAscending(!isAscending)}>
                                    {isAscending ? <TbSortDescending size={18} /> : <TbSortAscending size={18} />}
                                </button>

                                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>

                                {/* View Toggle buttons */}
                                <button
                                    title="List View"
                                    onClick={() => toggleListMode(_questionListView.LIST)}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${listMode === _questionListView.LIST ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200/50'}`}>
                                    <HiOutlineViewList size={18} />
                                </button>
                                <button
                                    title="Grid View"
                                    onClick={() => toggleListMode(_questionListView.SPLIT)}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${listMode === _questionListView.SPLIT ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200/50'}`}>
                                    <HiOutlineViewGrid size={18} />
                                </button>
                                <button
                                    title="Exam View"
                                    onClick={() => toggleListMode(_questionListView.EXAM_THEME_1)}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ${listMode === _questionListView.EXAM_THEME_1 ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200/50'}`}>
                                    <HiOutlineDocumentText size={18} />
                                </button>

                                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>

                                {/* Print button */}
                                <button
                                    title="Print Questions"
                                    className="p-2.5 rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-blue-600 transition-all duration-200"
                                    onClick={() => {
                                        dispatch(ModalActions.toggleModal('view-pdf-modal'));
                                    }}>
                                    <FaPrint size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 py-4 px-6 bg-[#4D96FF]/5 rounded-xl border border-[#4D96FF]/20">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#4D96FF]/10 rounded-lg text-[#4D96FF]">
                                <FaLayerGroup size={14} />
                            </div>
                            <span className="text-sm font-medium text-black">Total Posts:</span>
                            <span className="text-sm font-bold text-[#4D96FF] bg-[#4D96FF]/10 px-2.5 py-0.5 rounded-full">{postsList.length}</span>
                        </div>

                        <div className="hidden md:block w-[1px] h-4 bg-[#4D96FF]/20"></div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#4D96FF]/10 rounded-lg text-[#4D96FF]">
                                <FaBook size={14} />
                            </div>
                            <span className="text-sm font-medium text-black">Total Subjects:</span>
                            <span className="text-sm font-bold text-[#4D96FF] bg-[#4D96FF]/10 px-2.5 py-0.5 rounded-full">{subjectsList.length}</span>
                        </div>

                        <div className="hidden md:block w-[1px] h-4 bg-[#4D96FF]/20"></div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#4D96FF]/10 rounded-lg text-[#4D96FF]">
                                <FaTags size={14} />
                            </div>
                            <span className="text-sm font-medium text-black">Total Topics:</span>
                            <span className="text-sm font-bold text-[#4D96FF] bg-[#4D96FF]/10 px-2.5 py-0.5 rounded-full">{topicsList.length}</span>
                        </div>

                        <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                            Live Dataset
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[95%] mx-auto mt-8 px-4 pb-12">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
                        <p className="text-gray-500 font-medium animate-pulse">Fetching your questions...</p>
                    </div>
                )}
                {!isLoading && questionsList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                        <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FaLayerGroup size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Questions Found</h3>
                        <p className="text-gray-500 mb-8 max-w-md text-center">
                            We couldn't find any questions matching your filters. Try adjusting your search or add a new question.
                        </p>
                        <CButton
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                            onClick={() => navigate('/question-form')}>
                            Add New Question
                        </CButton>
                    </div>
                )}

                {questionsList.length > 0 && listMode === _questionListView.LIST && (
                    <QuestionsListAccordion
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {questionsList.length > 0 && listMode === _questionListView.SPLIT && (
                    <QuestionsListIEEFormat
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {questionsList.length > 0 && listMode === _questionListView.EXAM_THEME_1 && (
                    <ExamThemeView
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                    />
                )}
            </div>
        </>
    );
}

function QuestionsListAccordion({ questionsList, handleEditQuestion, handleDeleteQuestion }) {
    const [expandedItem, setExpandedItem] = useState(null);

    const handleAccordionChange = (e) => {
        if (e[0] == expandedItem) {
            setExpandedItem(null);
        } else {
            setExpandedItem(e[0]);
        }
    };

    return (
        <>
            <div className={`overflow-auto h-[550px] custom-scrollbar space-y-4 pr-2`}>
                <Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
                    {questionsList.length >= 1 &&
                        questionsList.map((el, idx) => {
                            return (
                                <AccordionItem
                                    className={`mb-3 rounded-xl overflow-hidden border transition-all duration-300 ${expandedItem === idx ? 'ring-2 ring-blue-400 border-transparent shadow-lg' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                                    key={idx}
                                    uuid={idx}
                                >
                                    <AccordionHeadingItem
                                        expandedItem={expandedItem}
                                        idx={idx}
                                        el={el}
                                        handleEditQuestion={handleEditQuestion}
                                        handleDeleteQuestion={handleDeleteQuestion}
                                    />
                                    <AccordionItemPanel className="p-0">
                                        <div className="p-6 space-y-6 bg-white">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="size-2 bg-blue-500 rounded-full"></span>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-black opacity-60">
                                                        Question Statement
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-black font-semibold leading-relaxed prose prose-slate max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: el.mqs_question }}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Option A', content: el.mqs_opt_one },
                                                    { label: 'Option B', content: el.mqs_opt_two },
                                                    { label: 'Option C', content: el.mqs_opt_three },
                                                    { label: 'Option D', content: el.mqs_opt_four },
                                                    { label: 'Option E', content: el.mqs_opt_five },
                                                ].filter(opt => opt.content).map((opt, i) => (
                                                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200">
                                                        <span className="text-xs font-bold text-black opacity-50 mb-2 block">{opt.label}</span>
                                                        <div className="text-black font-medium" dangerouslySetInnerHTML={{ __html: opt.content }} />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-gray-500">Correct Answer:</span>
                                                    <span className="size-8 flex items-center justify-center bg-green-100 text-green-700 font-bold rounded-lg shadow-sm border border-green-200">
                                                        {el.mqs_ans?.toUpperCase()}
                                                    </span>
                                                </div>

                                                {el.mqs_solution && (
                                                    <div className="flex-1 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                                        <span className="text-xs font-bold text-amber-700 mb-2 block uppercase">Detailed Solution</span>
                                                        <div
                                                            className="text-black font-medium text-sm leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: el.mqs_solution }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            );
                        })}
                </Accordion>
            </div>
        </>
    );
}

function AccordionHeadingItem({ expandedItem, idx, el, handleEditQuestion, handleDeleteQuestion }) {
    return (
        <>
            <AccordionItemHeading
                className={`transition-all duration-300 ${expandedItem == idx ? 'bg-blue-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <AccordionItemButton className="focus:outline-none">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="flex-1 flex items-center gap-4 overflow-hidden">
                            <div className={`flex flex-col items-center justify-center min-w-[54px] h-10 rounded-lg border leading-none ${expandedItem == idx ? 'bg-white/20 border-white/30 text-white' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
                                <span className="text-[9px] font-bold uppercase opacity-60 mb-0.5"># {idx + 1}</span>
                                <span className="text-[10px] font-mono font-black uppercase">ID:{el.id}</span>
                            </div>

                            <div className="flex-1 truncate">
                                {expandedItem != idx ? (
                                    <div
                                        className="text-sm font-bold text-black truncate"
                                        dangerouslySetInnerHTML={{ __html: el.mqs_question }}
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-white">Viewing Detailed View</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                            <button
                                title="Edit Question"
                                className={`size-10 flex items-center justify-center rounded-full transition-all duration-300 ${expandedItem == idx ? 'bg-blue-400/30 text-blue-100 hover:bg-blue-400/50' : 'bg-[#4D96FF]/10 text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white shadow-sm border border-blue-100'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditQuestion(el.id);
                                }}>
                                <FaEdit size={14} />
                            </button>

                            <button
                                title="Delete Question"
                                className={`size-10 flex items-center justify-center rounded-full transition-all duration-300 ${expandedItem == idx ? 'bg-red-500/30 text-red-100 hover:bg-red-500/50' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-sm border border-red-100'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteQuestion(el.id);
                                }}>
                                <FaTrash size={14} />
                            </button>

                            <div className={`ml-1 transition-transform duration-300 ${expandedItem == idx ? 'rotate-180 text-white' : 'text-gray-400'}`}>
                                <FaChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                </AccordionItemButton>
            </AccordionItemHeading>
        </>
    );
}

function QuestionsListIEEFormat({ questionsList, handleEditQuestion, handleDeleteQuestion }) {
    return (
        <div className="h-[750px] overflow-auto custom-scrollbar p-6 border border-gray-200/60 rounded-3xl bg-gray-50/50 backdrop-blur-sm shadow-inner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {questionsList.map((el, idx) => {
                    return (
                        <div
                            className="flex flex-col h-[550px] bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-[#4D96FF]/50 transition-all duration-500 group overflow-hidden shining-card"
                            key={idx}>

                            {/* Header / ID Badge - Fixed at top */}
                            <div className="flex justify-between items-center px-5 py-3 bg-gray-50/90 border-b border-gray-200 shrink-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black bg-[#4D96FF] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        #{idx + 1}
                                    </span>
                                    <span className="text-xs font-bold text-black font-mono">QID: {el.id}</span>
                                </div>
                                <div className="flex gap-2 opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => handleEditQuestion(el.id)}
                                        className="size-8 flex items-center justify-center rounded-lg bg-[#4D96FF]/10 text-[#4D96FF] hover:bg-[#4D96FF] hover:text-white transition-all shadow-sm">
                                        <FaPencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(el.id)}
                                        className="size-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
                                {/* Question */}
                                <div className="space-y-2">
                                    <div
                                        className="text-black font-bold leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: el.mqs_question }}
                                    />
                                </div>

                                {/* Options Grid */}
                                <div className="grid grid-cols-1 gap-2.5">
                                    {[
                                        { label: 'A', content: el.mqs_opt_one },
                                        { label: 'B', content: el.mqs_opt_two },
                                        { label: 'C', content: el.mqs_opt_three },
                                        { label: 'D', content: el.mqs_opt_four },
                                        { label: 'E', content: el.mqs_opt_five },
                                    ].filter(opt => opt.content).map((opt, i) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 group/opt hover:bg-white hover:border-[#4D96FF]/30 hover:shadow-sm transition-all">
                                            <span className="size-6 shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-[10px] font-black text-black group-hover/opt:border-blue-200 group-hover/opt:text-blue-500 shadow-sm transition-all">
                                                {opt.label}
                                            </span>
                                            <div className="text-sm text-black font-semibold" dangerouslySetInnerHTML={{ __html: opt.content }} />
                                        </div>
                                    ))}
                                </div>

                                {/* Answer & Solution */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-black opacity-40 uppercase">Correct:</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded text-xs">
                                            {el.mqs_ans?.toUpperCase()}
                                        </span>
                                    </div>
                                    {el.mqs_solution && (
                                        <div className="flex-1 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100/50">
                                            <HiOutlineDocumentText size={14} className="text-amber-600" />
                                            <span className="text-[10px] font-bold text-amber-700 uppercase">Has Solution</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Publication Info Table - Fixed at bottom */}
                            <div className="px-6 pb-6 shrink-0">
                                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100/30">
                                    <table className="w-full text-[10px]">
                                        <thead>
                                            <tr className="bg-gray-100/50 text-black font-bold uppercase tracking-wider border-b border-gray-100">
                                                <th className="px-3 py-2 text-left">Publication</th>
                                                <th className="px-3 py-2 text-left">Book</th>
                                                <th className="px-3 py-2 text-center">Page</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-black font-bold">
                                            <tr>
                                                <td className="px-3 py-2 border-r border-gray-100">
                                                    {el?.msq_publication_name || el?.pub_name || 'NA'}
                                                </td>
                                                <td className="px-3 py-2 border-r border-gray-100 font-bold">
                                                    {el.msq_book_name || 'NA'}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {el?.maq_page_number || el?.pg_no || 'NA'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function ExamThemeView({ questionsList, handleEditQuestion, isEdit = true }) {
    if (questionsList.length === 0) return null;
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questionsList[idx]);

    useEffect(() => {
        setCurrentQuestion(questionsList[idx]);
    }, [idx, questionsList]);

    return (
        <>
            {/* Trigger button */}
            <div className="flex justify-center mt-20">
                <CButton
                    icon={<FaEye size={20} />}
                    disabled={questionsList.length === 0}
                    className="px-12 py-5 text-xl font-bold bg-[#4D96FF] hover:bg-[#3B82F6] shadow-2xl shadow-blue-200/50 transform hover:scale-110 transition-all duration-300 rounded-full"
                    onClick={() => {
                        dispatch(ModalActions.toggleModal('exam-theme-1-modal'));
                    }}>
                    <span>Launch Exam View</span>
                </CButton>
            </div>

            <CModal
                id="exam-theme-1-modal"
                title={`Exam View`}
                className="!w-[97vw] !h-[97vh] !z-40">
                <div className="container mx-auto p-3 border h-[85vh]">
                    <div className="grid grid-cols-7 gap-6 h-full">
                        {/* Main Question Area */}
                        <div className="col-span-5 flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto pr-2">
                                {/* {topicHeader} */}
                                <QuestionUi q={currentQuestion} idx={idx} />
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <CButton
                                    disabled={idx === 0}
                                    className="px-6 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm"
                                    onClick={() => setIdx((prev) => prev - 1)}>
                                    <FaArrowAltCircleLeft />
                                    <span>Previous</span>
                                </CButton>

                                {isEdit && (
                                    <CButton
                                        onClick={handleEditQuestion.bind(null, currentQuestion.id)}
                                        className="bg-[#4D96FF] text-white hover:bg-[#3B82F6] shadow-md shadow-blue-200 border border-[#4D96FF] rounded-full">
                                        <FaPencil />
                                        <span>Edit</span>
                                    </CButton>
                                )}

                                <CButton
                                    disabled={questionsList.length === idx + 1}
                                    className="px-6 bg-[#4D96FF] text-white hover:bg-[#3B82F6] shadow-md shadow-blue-200 rounded-full"
                                    onClick={() => setIdx((prev) => prev + 1)}>
                                    <span>Next</span>
                                    <FaArrowAltCircleRight />
                                </CButton>
                            </div>
                        </div>

                        {/* Question numbers grid */}
                        <div className="col-span-2 border border-blue-200 p-3 overflow-y-auto max-h-full">
                            <div className="grid grid-cols-5 gap-3">
                                {questionsList.map((_q, _i) => (
                                    <div
                                        key={_i}
                                        className={`border rounded-md size-10 flex items-center justify-center cursor-pointer transition ${idx === _i
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-white hover:bg-gray-100'
                                            }`}
                                        onClick={() => setIdx(_i)}>
                                        {_i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CModal>
        </>
    );
}

function QuestionUi({ idx, q }) {
    return (
        <div className="border p-4 rounded-md shadow-sm bg-gray-50">
            <div className="text-lg mb-3 text-gray-900 flex">
                Q {idx + 1}.{' '}
                <span
                    className="inline-block"
                    dangerouslySetInnerHTML={{
                        __html: q?.q || q?.mqs_question || '-',
                    }}
                />
            </div>

            <div className="pl-4 space-y-2">
                {(q?.q_a || q?.mqs_opt_one) && (
                    <QuestionOption option="A" html={q?.q_a || q?.mqs_opt_one || '-'} />
                )}
                {(q?.q_b || q?.mqs_opt_two) && (
                    <QuestionOption option="B" html={q?.q_b || q?.mqs_opt_two || '-'} />
                )}
                {(q?.q_c || q?.mqs_opt_three) && (
                    <QuestionOption option="C" html={q?.q_c || q?.mqs_opt_three || '-'} />
                )}
                {(q?.q_d || q?.mqs_opt_four) && (
                    <QuestionOption option="D" html={q?.q_d || q?.mqs_opt_four || '-'} />
                )}
                {(q?.q_e || q?.mqs_opt_five) && (
                    <QuestionOption option="E" html={q?.q_e || q?.mqs_opt_five || '-'} />
                )}
            </div>

            <div className="mt-3 text-sm text-black border-t pt-2 flex justify-center">
                Correct Answer:&nbsp;
                <strong className="text-green-700">{q?.q_ans?.toUpperCase() || q?.mqs_ans?.toUpperCase() || '-'}</strong>
            </div>
        </div>
    );
}

function QuestionOption({ option, html }) {
    return (
        <div className="flex gap-2 items-start">
            <span className="font-bold text-black">{option}.</span>
            <span
                className="inline-block text-black font-semibold"
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
}

export default QuestionsList;
