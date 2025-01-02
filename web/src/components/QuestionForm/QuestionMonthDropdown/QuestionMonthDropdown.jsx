import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.jsx';

function QuestionMonthDropdown() {
	// prettier-ignore
	const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', ];

	const dispatch = useDispatch();
	const { data: _formData, errors } = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Month</label>
			<div className="flex">
				<select className="input-el grow w-48" name="month" onChange={handleChange}>
					<option value="" className="">
						-- Select --
					</option>
					{months.map((el, idx) => {
						return (
							<option key={idx} value={el} selected={_formData.month == el ? true : false}>
								{el}
							</option>
						);
					})}
				</select>
			</div>

			{errors.month && <div className=" error">{errors.month}</div>}
		</div>
	);
}

export default QuestionMonthDropdown;
