import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

function InputCkEditor({ option, handleChange, _formData }) {
	return (
		<>
			<div key={option}>
				<label htmlFor={`option-${option}`}>{option}</label>

				<div className="ckeditor">
					<CKEditor
						id={`option-${option}`}
						editor={ClassicEditor}
						onChange={(e, editor) => {
							console.log(editor, '==editor==');
							handleChange({
								target: {
									name: `option_${option}`,
									value: editor.getData(),
								},
							});
						}}
						data={_formData[`option_${option}`]}
					/>
				</div>
			</div>
		</>
	);
}

export default InputCkEditor;
