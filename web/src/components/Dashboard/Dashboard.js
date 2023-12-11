import react from 'react';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
    const navigate = useNavigate();
    return (
        <>
            <div className="row">
                <div className="col-sm-3 mb-3 mb-sm-0">
                    <div className="card">
                        <div className="card-body pe-0">
                            <div className="d-flex gap-2">
                                <i className="fa-solid fa-square-check fa-2x text-secondary"></i>
                                <div className="w-100">
                                    <h5 className="card-title">Total Test</h5>
                                    <div className="card-text fs-3 fw-bold">10</div>
                                    <div className="w-100 bg-success">
                                        <button
                                            className="btn btn-success btn-sm "
                                            onClick={() => {
                                                navigate('/add-new-test-form');
                                            }}>
                                            <i className="fa-solid fa-plus pe-2"></i>
                                            <span>ADD NEW TEST</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
