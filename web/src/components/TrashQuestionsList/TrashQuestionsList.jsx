import { useEffect, useState } from 'react';
import { BiReset } from 'react-icons/bi';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaAngleRight, FaLayerGroup, FaBook, FaTags, FaSearch, FaTrash, FaUndoAlt, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPostListThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';

import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import Swal from 'sweetalert2';
import CButton from '../UI/CButton.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

function TrashQuestionsList() {
    const dispatch = useDispatch();

    const {
        data: _formData,
        postsList,
        subjectsList,
        topicsList,
    } = useSelector((state) => state.questionForm);
    const { isLoading } = useSelector((state) => state.loader);

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

    const [questionList, setQuestionList] = useState([]);

    async function getQuestions() {
        let reqData = {
            url: SERVER_IP + '/api/questions/list-trash',
            method: 'POST',
            body: JSON.stringify({
                post_id: _formData.post_id,
                subject_id: _formData.subject_id,
                topic_id: _formData.topic_id,
            }),
        };
        sendRequest(reqData, (data) => {
            setQuestionList(data.data);
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
            text: 'This question will delete permently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmDeleteQuestionPermenant(id);
            }
        });
    };

    const confirmDeleteQuestionPermenant = (id) => {
        let reqData = {
            url: SERVER_IP + '/api/questions/delete-permenant',
            method: 'DELETE',
            body: JSON.stringify({ questionId: id }),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                setQuestionList(questionList.filter((el) => el.id != id));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Question has been removed permenantly.',
                    icon: 'success',
                });
            }
        });
    };

    const handleRestoreQuestion = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Question will restored!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmRestoreQuestion(id);
            }
        });
    };

    const confirmRestoreQuestion = (id) => {
        let reqData = {
            url: SERVER_IP + '/api/questions/restore',
            method: 'DELETE',
            body: JSON.stringify({ questionId: id }),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                setQuestionList(questionList.filter((el) => el.id != id));
                Swal.fire({
                    title: 'Successful!',
                    text: 'Question has been restored.',
                    icon: 'success',
                });
            }
        });
    };

    const [expandedItem, setExpandedItem] = useState(null);
    const handleAccordionChange = (e) => {
        if (e == expandedItem) {
            setExpandedItem(null);
        } else {
            setExpandedItem(e[0]);
        }
    };

    return (
        <>
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
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-[#4D96FF]/5 border-t border-[#4D96FF]/10">
                    <div className="flex flex-wrap items-center gap-4">
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

                        <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-[#4D96FF]/60 uppercase tracking-widest">
                            <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            Live Dataset
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[95%] mx-auto mt-8 px-4 pb-12">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#4D96FF]" />
                        <p className="text-gray-500 font-medium animate-pulse">Fetching trash questions...</p>
                    </div>
                )}
                {!isLoading && questionList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                        <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FaTrash size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Trash is Empty</h3>
                        <p className="text-gray-500 mb-8 max-w-md text-center">
                            No deleted questions found in this category.
                        </p>
                    </div>
                )}
                <Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
                    {questionList.length >= 1 &&
                        questionList.map((el, idx) => {
                            return (
                                <AccordionItem
                                    className={`mb-3 rounded-xl overflow-hidden border transition-all duration-300 ${expandedItem === idx ? 'ring-2 ring-[#4D96FF]/50 border-transparent shadow-lg' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                                    key={idx}
                                    uuid={idx}
                                >
                                    <AccordionItemHeading
                                        className={`transition-all duration-300 ${expandedItem == idx ? 'bg-[#4D96FF]' : 'bg-gray-50 hover:bg-gray-100'}`}>
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
                                                        title="Restore Question"
                                                        className={`size-10 flex items-center justify-center rounded-full transition-all duration-300 ${expandedItem == idx ? 'bg-green-500/30 text-green-100 hover:bg-green-500/50' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white shadow-sm border border-green-100'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRestoreQuestion(el.id);
                                                        }}>
                                                        <FaUndoAlt size={14} />
                                                    </button>

                                                    <button
                                                        title="Delete Permanently"
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

            {/* <div className="container mx-auto mt-6">
				<h3 className="heading-3__dark ">Post List</h3>
				<div class="relative overflow-x-auto">
					<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr className="bg-blue-200">
								<th scope="col" class="px-6 py-3">
									#
								</th>
								<th scope="col" class="px-6 py-3">
									Post Name
								</th>
								<th scope="col" class="px-6 py-3 text-center">
									Topic For Post
								</th>

								<th scope="col" class="px-6 py-3">
									View
								</th>
							</tr>
						</thead>
						<tbody>
							{postsList.length >= 1 &&
								postsList.map((el, i) => {
									return (
										<tr class="border-b dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 bg-gray-100 hover:bg-white">
											<td
												width={'4%'}
												scope="row"
												class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
												{i + 1}
											</td>
											<td
												scope="row"
												class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
												{el.mtl_test_name}
											</td>
											<td width={'15%'} class="px-6 py-2 text-center">
												{el.total_topics}
											</td>
											<td class="px-6 py-2">
												<CButton
													className=""
													icon={<FaEye className="text-2xl" />}
													varient="btn--warning"
													onClick={handleGetSubjectsList.bind(null, el.id)}
												/>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div> */}
        </>
    );
}

export default TrashQuestionsList;
