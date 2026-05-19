import React from 'react';
import CButton from '../../UI/CButton.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import { FaPlus } from 'react-icons/fa';
import { QuestionFormActions } from '../../../Store/question-form-slice.jsx';
import { memo } from 'react';

function PostListDropdown({ isShowAddNewBtn = true }) {
    const dispatch = useDispatch();
    const postId = useSelector((state) => state.questionForm.data.post_id);

    const { postsList, errors } = useSelector((state) => state.questionForm);
    const handleChange = async (e) => {
        dispatch(
            QuestionFormActions.handleInputChange({
                key: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handlePostAddModal = () => {
        dispatch(ModalActions.toggleModal('add-post-modal'));
    };

    console.log('rendering post list dropdown');
    return (
        <div className="flex flex-col gap-1 relative">
            <label htmlFor="post-id" className="input-label text-sm font-medium text-gray-700">
                Post *
            </label>
            <div className="flex items-center gap-2">
                {isShowAddNewBtn && <CButton onClick={handlePostAddModal} icon={<FaPlus />} />}
                <select
                    id="post-id"
                    className="input-el grow w-48"
                    name="post_id"
                    onChange={handleChange}
                    defaultValue={postId}>
                    <option value="" className="" name="">
                        -- Select --
                    </option>
                    {postsList.length >= 1 &&
                        postsList?.map((subject, i) => (
                            <option key={i} value={subject.id}>
                                {subject.mtl_test_name}
                            </option>
                        ))}
                </select>
            </div>
            {errors.post_id && <div className=" error">{errors.post_id}</div>}
        </div>
    );
}

export default memo(PostListDropdown);
