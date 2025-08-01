import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../Store/question-form-slice.jsx';
import CButton from '../UI/CButton.jsx';

function EditOptionsInput({ showNewInputField, setShowNewInputField }) {
    const { data: _formData, errors, questionNumber } = useSelector((state) => state.questionForm);
    const dispatch = useDispatch();
    useEffect(() => {
        /**
         * Replace function replaces the textarea element with ck editor instance
         * */
        let questionContentInstance = window.CKEDITOR.instances['mqs_question'];
        let optionAInstance = window.CKEDITOR.instances['mqs_opt_one'];
        let optionBInstance = window.CKEDITOR.instances['mqs_opt_two'];
        let optionCInstance = window.CKEDITOR.instances['mqs_opt_three'];
        let optionDInstance = window.CKEDITOR.instances['mqs_opt_four'];

        if (questionContentInstance) {
            questionContentInstance.destroy(true);
        }
        if (optionAInstance) {
            optionAInstance.destroy(true);
        }

        if (optionBInstance) {
            optionBInstance.destroy(true);
        }

        if (optionCInstance) {
            optionCInstance.destroy(true);
        }

        if (optionDInstance) {
            optionDInstance.destroy(true);
        }

        window.CKEDITOR.replace(`mqs_question`, {
            height: 100,
        });

        window.CKEDITOR.replace(`mqs_opt_one`, {
            height: 100,
        });

        window.CKEDITOR.replace(`mqs_opt_two`, {
            height: 100,
        });
        window.CKEDITOR.replace(`mqs_opt_three`, {
            height: 100,
        });

        window.CKEDITOR.replace(`mqs_opt_four`, {
            height: 100,
        });

        /**
         * Get value of the editor by listening to change event
         * Value is available by calling .getData() function
         * */
        window.CKEDITOR.instances[`mqs_question`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_question`,
                    value: window.CKEDITOR.instances[`mqs_question`].getData(),
                })
            );
        });

        window.CKEDITOR.instances[`mqs_opt_one`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_opt_one`,
                    value: window.CKEDITOR.instances[`mqs_opt_one`].getData(),
                })
            );
        });

        window.CKEDITOR.instances[`mqs_opt_two`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_opt_two`,
                    value: window.CKEDITOR.instances[`mqs_opt_two`].getData(),
                })
            );
        });

        window.CKEDITOR.instances[`mqs_opt_three`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_opt_three`,
                    value: window.CKEDITOR.instances[`mqs_opt_three`].getData(),
                })
            );
        });
        window.CKEDITOR.instances[`mqs_opt_four`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_opt_four`,
                    value: window.CKEDITOR.instances[`mqs_opt_four`].getData(),
                })
            );
        });
    }, []);

    useEffect(() => {
        let optionEInstance = window.CKEDITOR?.instances['mqs_opt_five'];

        if (!optionEInstance && !_formData.showOptionE) {
            return;
        }

        if (optionEInstance) {
            optionEInstance.destroy(true);
            return;
        }

        window.CKEDITOR.replace(`mqs_opt_five`, {
            height: 100,
        });

        window.CKEDITOR.instances[`mqs_opt_five`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_opt_five`,
                    value: window.CKEDITOR.instances[`mqs_opt_five`].getData(),
                })
            );
        });
    }, [_formData.showOptionE]);

    const handleShowOptionE = () => {
        dispatch(QuestionFormActions.toggleShowOptionE());
    };
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 relative">
                <div className="flex gap-2">
                    <label
                        htmlFor="mqs_question"
                        className="question-option !top-[-3rem] !rounded-sm">
                        Question&nbsp;
                    </label>

                    <span className="bg-purple-200 text-gray-700 px-2 py-1 font-bold">
                        {_formData.id}
                    </span>
                </div>

                <textarea
                    name={`mqs_question`}
                    id={`mqs_question`}
                    value={_formData.mqs_question}
                    className="top-10"></textarea>
                {errors.mqs_question && <div className="error">{errors.mqs_question}</div>}
                <ImageInputComp label="Question image" inputFor="mqs_question" />
            </div>

            <hr />

            <div className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-2">
                    <label htmlFor="mqs_opt_one" className="question-option !top-[-3rem]">
                        Option A
                    </label>
                    <AnswerOptionRadioBox value={'A'} />
                </div>
                <textarea
                    name={`mqs_opt_one`}
                    id={`mqs_opt_one`}
                    value={_formData.mqs_opt_one}
                    className="top-10"></textarea>
                {errors.mqs_opt_one && <div className=" error">{errors.mqs_opt_one}</div>}
                <ImageInputComp label="Option A image" inputFor="mqs_opt_one" />
            </div>

            <hr />

            <div className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-2">
                    <label htmlFor="mqs_opt_two" className="question-option !top-[-3rem]">
                        Option B
                    </label>

                    <AnswerOptionRadioBox value={'B'} />
                </div>
                <textarea
                    name={`mqs_opt_two`}
                    id={`mqs_opt_two`}
                    value={_formData.mqs_opt_two}
                    className="top-10"></textarea>
                {errors.mqs_opt_two && <div className=" error">{errors.mqs_opt_two}</div>}
                <ImageInputComp label="Option B image" inputFor="mqs_opt_two" />
            </div>

            <hr />

            <div className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-2">
                    <label htmlFor="mqs_opt_three" className="question-option !top-[-3rem]">
                        Option C
                    </label>

                    <AnswerOptionRadioBox value={'C'} />
                </div>
                <textarea
                    name={`mqs_opt_three`}
                    id={`mqs_opt_three`}
                    value={_formData.mqs_opt_three}
                    className="top-10"></textarea>
                {errors.mqs_opt_three && <div className=" error">{errors.mqs_opt_three}</div>}
                <ImageInputComp label="Option C image" inputFor="mqs_opt_three" />
            </div>

            <hr />

            <div className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-2">
                    <label htmlFor="mqs_opt_four" className="question-option !top-[-3rem]">
                        Option D
                    </label>

                    <AnswerOptionRadioBox value={'D'} />
                </div>
                <textarea
                    name={`mqs_opt_four`}
                    id={`mqs_opt_four`}
                    value={_formData.mqs_opt_four}
                    className="top-10"></textarea>
                {errors.mqs_opt_four && <div className=" error">{errors.mqs_opt_four}</div>}
                <ImageInputComp label="Option D image" inputFor="mqs_opt_four" />
            </div>

            <hr />

            {_formData.showOptionE ? (
                <>
                    <div className="flex flex-col gap-3 relative">
                        <div className="flex gap-2 items-center">
                            <label htmlFor="mqs_opt_five" className="question-option !top-[-3rem]">
                                Option E
                            </label>

                            <AnswerOptionRadioBox value={'E'} />
                        </div>
                        <textarea
                            name={`mqs_opt_five`}
                            id={`mqs_opt_five`}
                            value={_formData.mqs_opt_five}
                            className="top-10"></textarea>
                        {errors.mqs_opt_five && (
                            <div className="!top-[1rem]">{errors.mqs_opt_five}</div>
                        )}
                        <ImageInputComp label="Option E image" inputFor="mqs_opt_five" />
                    </div>

                    <CButton
                        className="btn--danger w-fit"
                        id=""
                        onClick={() => {
                            window.CKEDITOR?.instances['mqs_opt_five'].destroy(true);
                            dispatch(
                                QuestionFormActions.handleInputChange({
                                    key: 'mqs_opt_five',
                                    value: null,
                                })
                            );
                            handleShowOptionE();
                        }}>
                        Remove
                    </CButton>

                    <hr />
                </>
            ) : (
                <CButton className="btn--success w-fit" id="" onClick={handleShowOptionE}>
                    Add option
                </CButton>
            )}
        </div>
    );
}

function ImageInputComp({ label, inputFor }) {
    const { data: _formData } = useSelector((state) => state.questionForm);
    const dispatch = useDispatch();

    const handleImagePaste = (e) => {
        let pasteImageFor = e.currentTarget.attributes['data-image-for'].value;
        let pastedFile = e.clipboardData?.items[0].getAsFile();
        if (!pastedFile) {
            e.preventDefault();
            return false;
        }

        let reader = new FileReader();
        reader.onloadend = function () {
            let _fileB64 = reader.result;
            switch (pasteImageFor) {
                case 'mqs_question':
                    appendImage('mqs_question', _fileB64);
                    break;
                case 'mqs_opt_one':
                    appendImage('mqs_opt_one', _fileB64);
                    break;

                case 'mqs_opt_two':
                    appendImage('mqs_opt_two', _fileB64);
                    break;

                case 'mqs_opt_three':
                    appendImage('mqs_opt_three', _fileB64);
                    break;

                case 'mqs_opt_four':
                    appendImage('mqs_opt_four', _fileB64);
                    break;

                case 'mqs_opt_five':
                    appendImage('mqs_opt_five', _fileB64);
                    break;
            }
        };

        reader.readAsDataURL(pastedFile);
    };

    function appendImage(appendFor, _file) {
        let oldValue = _formData[`${appendFor}`];
        if (!oldValue) {
            oldValue = '';
        }
        dispatch(
            QuestionFormActions.handleInputChange({
                key: `${appendFor}`,
                value: oldValue + ` <p><img src='${_file}'/></p>`,
            })
        );
        setTimeout(() => {
            window.CKEDITOR.instances[`${appendFor}`].setData(_formData.appendFor);
        }, 1);
    }

    return (
        <div className="flex flex-col mt-2 absolute bottom-0 left-0">
            <input
                onPaste={handleImagePaste}
                type="text"
                data-image-for={inputFor}
                className="input-el !w-[15rem]"
                placeholder={`${label} paste image`}
            />
        </div>
    );
}

function AnswerOptionRadioBox({ value, className }) {
    const dispatch = useDispatch();
    const { data: _formData } = useSelector((state) => state.questionForm);
    const handleOptionChange = (e) => {
        dispatch(
            QuestionFormActions.handleInputChange({
                key: e.target.name,
                value: e.target.value,
            })
        );
    };
    return (
        <input
            className={`w-6 h-6 ${className}`}
            type="radio"
            name="mqs_ans"
            value={value}
            checked={_formData.mqs_ans == value ? true : false}
            onChange={handleOptionChange}
        />
    );
}

export default EditOptionsInput;
