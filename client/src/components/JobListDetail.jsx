import React, {useContext, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import ReactDOM from "react-dom";
import JobFinder from "../apis/JobFinder"
import {JobsContext} from '../context/JobContext'
import MDEditor from '@uiw/react-md-editor';

const JobListDetail = (props) => {
    const {jobs, setJobs} = useContext(JobsContext)
    const {id} = useParams();

    let history = useHistory()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await JobFinder.get("/");
                setJobs(response.data.data.jobs)
            } catch (err) {

            }
        }
        fetchData();
    }, [])


    const handleApplyRedirect = (e, id, link) => {
        e.stopPropagation()
        window.location.assign(link);
    };

    const handleJobSelect = (id) => {
        history.push(``)
    };

    return (
        <div class="list-group mt-3 ">
            <h5 className="ml-2">Today's good WLB jobs</h5>
            <p className="ml-2">(click each row to view details about the job)</p>
            <table class="table table-condensed ">
                <tbody>
                {jobs && jobs.sort((a, b) => a.id < b.id ? 1 : -1).map(job => {
                    if (job.id.toString() === id) {
                        return (
                            <>
                                <tr
                                    className={job.color === '#fff9c9' ? "highlight" : "none"}
                                    onClick={() => handleJobSelect(job.id)}
                                    key={job.id}
                                >
                                    <td>{job.name}</td>
                                    <td>{job.primary_tag}</td>
                                    <td>{job.pay}</td>
                                    <td>
                                        <button
                                            onClick={(e) => handleApplyRedirect(e, job.id, job.link)}
                                            className="btn btn-primary btn-sm"
                                        >Apply
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="container" colSpan="999">
                                        <div className="row justify-content-center pl-3 pr-3">
                                            <MDEditor.Markdown className="" source={job.description} />
                                        </div>
                                        <div className="row justify-content-center pl-3 pr-3">
                                            <button
                                                onClick={(e) => handleApplyRedirect(e, job.id, job.link)}
                                                className="mt-2 btn btn-primary "
                                            >Apply for this Job
                                            </button>
                                        </div>

                                    </td>
                                </tr>
                            </>
                        );
                    } else {
                        return (
                            <tr
                                className={job.color === '#fff9c9' ? "highlight" : "none"}
                                onClick={() => handleJobSelect(job.id)}
                                key={job.id}
                            >
                                <td>{job.name}</td>
                                <td>{job.primary_tag}</td>
                                <td>{job.pay}</td>
                                <td>
                                    <button
                                        onClick={(e) => handleApplyRedirect(e, job.id, job.link)}
                                        className="btn btn-primary btn-sm"
                                    >Apply
                                    </button>
                                </td>
                            </tr>
                        );
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}

export default JobListDetail
