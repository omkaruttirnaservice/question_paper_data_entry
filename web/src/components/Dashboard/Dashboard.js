import { FaEye } from 'react-icons/fa';
import CButton from '../UI/CButton.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostListThunk } from '../../Store/question-form-slice.js';

function Dashboard() {
	const dispatch = useDispatch();
	const { postsList } = useSelector((state) => state.questionForm);

	useEffect(() => {
		if (postsList.length === 0) {
			dispatch(getPostListThunk());
		}
	}, []);

	return (
		<>
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

export default Dashboard;
