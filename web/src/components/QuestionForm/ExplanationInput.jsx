import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../Store/question-form-slice.jsx';

function ExplanationInput({ showNewInputField, setShowNewInputField }) {
    const { data: _formData } = useSelector((state) => state.questionForm);
    const dispatch = useDispatch();
    useEffect(() => {
        /**
         * Replace function replaces the textarea element with ck editor instance
         * */
        let mqs_solutionInstance = window.CKEDITOR.instances['mqs_solution'];

        if (mqs_solutionInstance) {
            mqs_solutionInstance.destroy(true);
        }

        window.CKEDITOR.replace(`mqs_solution`, {
            height: 100,
        });

        /**
         * Get value of the editor by listening to change event
         * Value is available by calling .getData() function
         * */

        window.CKEDITOR.instances[`mqs_solution`].on('change', function () {
            dispatch(
                QuestionFormActions.handleInputChange({
                    key: `mqs_solution`,
                    value: window.CKEDITOR.instances[`mqs_solution`].getData(),
                })
            );
        });
    }, []);

    return (
        <>
            <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="mqs_solution" className="question-option !top-[-3rem]">
                    Explanation
                </label>
                <textarea
                    name={`mqs_solution`}
                    id={`mqs_solution`}
                    value={_formData.mqs_solution}
                    className="top-10"></textarea>
            </div>
        </>
    );
}

export default ExplanationInput;
